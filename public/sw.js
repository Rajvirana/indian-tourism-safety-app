const CACHE_NAME = 'indian-tourism-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/sw.js',
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.socket.io/4.7.2/socket.io.min.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                // Clone the request because it's a stream
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(response => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response because it's a stream
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                }).catch(() => {
                    // Return offline page for navigation requests
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for offline data
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Background sync triggered');
        event.waitUntil(syncOfflineData());
    }
});

// Push notifications for emergency alerts
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            vibrate: [200, 100, 200],
            tag: 'emergency',
            requireInteraction: true,
            actions: [
                {
                    action: 'view',
                    title: 'View Details'
                },
                {
                    action: 'close',
                    title: 'Close'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

async function syncOfflineData() {
    try {
        const offlineData = await getOfflineData();
        if (offlineData && Object.keys(offlineData).length > 0) {
            // Sync location data
            if (offlineData.locations) {
                for (const item of offlineData.locations) {
                    await fetch('/api/tracking/update', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${await getAuthToken()}`
                        },
                        body: JSON.stringify(item.data)
                    });
                }
            }
            
            // Sync SOS data
            if (offlineData.sos) {
                for (const item of offlineData.sos) {
                    await fetch('/api/sos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${await getAuthToken()}`
                        },
                        body: JSON.stringify(item.data)
                    });
                }
            }
            
            // Clear synced data
            await clearOfflineData();
        }
    } catch (error) {
        console.error('Sync error:', error);
    }
}

async function getOfflineData() {
    return new Promise((resolve) => {
        const request = indexedDB.open('OfflineDB', 1);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['offlineData'], 'readonly');
            const store = transaction.objectStore('offlineData');
            const getRequest = store.get('data');
            
            getRequest.onsuccess = () => {
                resolve(getRequest.result?.data || {});
            };
        };
    });
}

async function clearOfflineData() {
    return new Promise((resolve) => {
        const request = indexedDB.open('OfflineDB', 1);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['offlineData'], 'readwrite');
            const store = transaction.objectStore('offlineData');
            store.clear();
            transaction.oncomplete = () => resolve();
        };
    });
}

async function getAuthToken() {
    return new Promise((resolve) => {
        const request = indexedDB.open('AuthDB', 1);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['auth'], 'readonly');
            const store = transaction.objectStore('auth');
            const getRequest = store.get('token');
            
            getRequest.onsuccess = () => {
                resolve(getRequest.result?.token || '');
            };
        };
    });
}
