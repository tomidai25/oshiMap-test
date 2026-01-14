// console.log('map.js loaded');

// document.addEventListener('DOMContentLoaded', () => {

//   /* ==================================================
//     DOM取得
//   ================================================== */
//   const startScreen   = document.getElementById('startScreen');
//   const settingsBtn   = document.getElementById('settingsBtn');
//   const settingsPanel = document.getElementById('settingsPanel');
//   const settingsClose = document.getElementById('settingsClose');
//   const bgToggle      = document.getElementById('bgToggle');

//   const voiceBtn   = document.getElementById('voiceSelectBtn');
//   const voiceList  = document.getElementById('voiceSelectList');
//   const voiceLabel = document.getElementById('voiceSelectLabel');

//   const navVoiceBtn   = document.getElementById('navVoiceSelectBtn');
//   const navVoiceList  = document.getElementById('navVoiceSelectList');
//   const navVoiceLabel = document.getElementById('navVoiceSelectLabel');

//   const toast = document.getElementById('toast');
//   let toastTimer = null;

//   const addressInput = document.getElementById('addressInput');
//   const startNavBtn = document.getElementById('startNav');
//   const stopNavBtn  = document.getElementById('stopNav');

//   let goal = null;


//   /* ==================================================
//     トースト
//   ================================================== */
//   function showToast(message) {
//     if (!toast) return;
//     toast.textContent = message;
//     toast.classList.add('show');
//     clearTimeout(toastTimer);
//     toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
//   }


//   /* ==================================================
//     画面状態
//   ================================================== */
//   function showStartScreen() {
//     document.body.classList.add('is-start');
//     document.body.classList.remove('is-nav');
//     startScreen.style.display = 'block';
//   }
//   function showNavScreen() {
//     document.body.classList.add('is-nav');
//     document.body.classList.remove('is-start');
//     startScreen.style.display = 'none';
//   }
//   showStartScreen();


//   /* ==================================================
//     設定モーダル
//   ================================================== */
//   settingsBtn.addEventListener('click', e => {
//     e.stopPropagation();
//     settingsPanel.classList.add('open');
//     document.body.classList.add('settings-open');
//     settingsBtn.style.display = 'none';
//   });

//   settingsClose.addEventListener('click', e => {
//     e.stopPropagation();
//     settingsPanel.classList.remove('open');
//     document.body.classList.remove('settings-open');
//     settingsBtn.style.display = 'block';
//   });


//   /* ==================================================
//     背景モード
//   ================================================== */
//   const BG_KEY = 'bgMode';

//   function applyBgMode(mode) {
//     const isOshi = mode === 'oshi';
//     bgToggle.checked = isOshi;
//     document.body.classList.toggle('simple-bg', !isOshi);
//   }

//   applyBgMode(localStorage.getItem(BG_KEY) || 'oshi');

//   bgToggle.addEventListener('change', () => {
//     const mode = bgToggle.checked ? 'oshi' : 'simple';
//     applyBgMode(mode);
//     localStorage.setItem(BG_KEY, mode);
//   });


//   /* ==================================================
//     音声 + 広告管理
//   ================================================== */
//   const VOICE_KEY = 'voiceMode';
//   const FREE_VOICES = ['oshi', 'normal'];
//   const AD_UNLOCK_MS = 60 * 60 * 1000;

//   const adKey = v => `voiceAdUnlock_${v}`;

//   const isUnlocked = v => {
//     if (FREE_VOICES.includes(v)) return true;
//     const t = localStorage.getItem(adKey(v));
//     return t && Date.now() - Number(t) < AD_UNLOCK_MS;
//   };

//   const remainMs = v =>
//     Math.max(0, AD_UNLOCK_MS - (Date.now() - Number(localStorage.getItem(adKey(v)))));


//   function unlockByAd(voice) {
//     localStorage.setItem(adKey(voice), Date.now());
//     showToast('広告視聴が完了しました');
//     updateVoiceAdUI();
//   }


//   /* ==================================================
//     音声適用（UI同期）
//   ================================================== */
//   function applyVoiceMode(mode) {

//     // 広告未解放は選択不可
//     if (!isUnlocked(mode)) {
//       showToast('広告を視聴してください');
//       return;
//     }

//     localStorage.setItem(VOICE_KEY, mode);

//     syncVoiceUI(voiceList, voiceLabel, mode);
//     syncVoiceUI(navVoiceList, navVoiceLabel, mode);

//     const name =
//       voiceList?.querySelector(`li[value="${mode}"] .voice-name`)?.textContent;
//     if (name) showToast(`${name}に切り替えました`);
//   }

//   function syncVoiceUI(list, label, mode) {
//     if (!list) return;
//     list.querySelectorAll('li').forEach(li => {
//       const active = li.getAttribute('value') === mode;
//       li.classList.toggle('active', active);
//       if (active && label) {
//         label.textContent =
//           li.querySelector('.voice-name')?.textContent || li.textContent;
//       }
//     });
//   }


//   /* ==================================================
//     広告UI更新（共通）
//   ================================================== */
//   function updateVoiceAdUI() {
//     document.querySelectorAll('#voiceSelectList li, #navVoiceSelectList li')
//       .forEach(li => {
//         const voice = li.getAttribute('value');
//         const adArea = li.querySelector('.ad-area');
//         if (!adArea || FREE_VOICES.includes(voice)) {
//           if (adArea) adArea.textContent = '';
//           return;
//         }

//         adArea.innerHTML = '';

//         if (isUnlocked(voice)) {
//           const ms = remainMs(voice);

//           // ★ 残り時間が0以下なら即ロック扱い
//           if (ms <= 0) {
//             localStorage.removeItem(adKey(voice));
//             updateVoiceAdUI();
//             return;
//           }

//           const m = Math.floor(ms / 60000);
//           const s = Math.floor((ms % 60000) / 1000);
//           adArea.textContent = `残り ${m}:${String(s).padStart(2, '0')}`;
//           // ★ 残り60秒以下で警告表示
//           if (ms <= 60 * 1000) {
//             adArea.style.color = '#ff4d4f';
//             adArea.style.fontWeight = '700';
//           } else {
//             adArea.style.color ='';
//             adArea.style.fontWeight = '';
//             const btn = document.createElement('button');
//             btn.className = 'ad-btn';
//             btn.textContent = '広告を見る';
//             btn.addEventListener('click', e => {
//               e.stopPropagation();
//               unlockByAd(voice);
//             });
//             adArea.appendChild(btn);
//           }
//       }});
//   }


//   /* ==================================================
//     セレクト開閉
//   ================================================== */
//   voiceBtn?.addEventListener('click', e => {
//     e.stopPropagation();
//     voiceList.hidden = !voiceList.hidden;
//   });

//   navVoiceBtn?.addEventListener('click', e => {
//     e.stopPropagation();
//     navVoiceList.hidden = !navVoiceList.hidden;
//   });


//   /* ==================================================
//     音声選択（誤タップ対策込み）
//   ================================================== */
//   function attachVoiceSelect(list) {
//     if (!list) return;
//     list.querySelectorAll('li').forEach(li => {
//       li.addEventListener('click', e => {
//         e.stopPropagation();

//         const selected = li.getAttribute('value');
//         const current  = localStorage.getItem(VOICE_KEY);

//         if (selected === current) {
//           list.hidden = true;
//           return;
//         }

//         if (!isUnlocked(selected)) {
//           showToast('広告を視聴してください');
//           return;
//         }

//         applyVoiceMode(selected);
//         list.hidden = true;
//       });
//     });
//   }

//   attachVoiceSelect(voiceList);
//   attachVoiceSelect(navVoiceList);


//   /* ==================================================
//     外クリックで閉じる
//   ================================================== */
//   document.addEventListener('click', () => {
//     if (document.body.classList.contains('settings-open')) return;
//     voiceList && (voiceList.hidden = true);
//     navVoiceList && (navVoiceList.hidden = true);
//   });

//   function updateStartNavButton() {
//     if (!startNavBtn) return;

//     const disabled = !addressInput.value.trim();


//     startNavBtn.disabled = disabled;
//     startNavBtn.classList.toggle('disabled', disabled);
//   }

//   /* ==================================================
//   住所入力 → 目的地確定
//   ================================================== */
//   let addressTimer = null;

//   addressInput.addEventListener('input', () => {
//     const address = addressInput.value.trim();

//     // 空ならリセット
//     if (!address) {
//       goal = null;
//       updateStartNavButton();
//       return;
//     }

//     // 入力停止後に検索（連打防止）
//     clearTimeout(addressTimer);
//     addressTimer = setTimeout(() => {
//       searchAddress(address);
//     }, 600);
//   });


//   /* ==================================================
//     初期化
//   ================================================== */
//   applyVoiceMode(localStorage.getItem(VOICE_KEY) || 'normal');
//   updateVoiceAdUI();
//   setInterval(updateVoiceAdUI, 1000);
//   updateStartNavButton();

//   /* ==================================================
//     地図・ナビ
//   ================================================== */
//   let routeLayer = null;
//   let gpsWatchId = null;
//   let startMarker = null;
//   let goalMarker = null;

//   let currentMode = 'foot';
//   let start = { lat: 35.681236, lng: 139.767125 };
//   //let goal = null;
//   let isFollowLocation = true;


//   const map = L.map('map').setView([start.lat, start.lng], 16);

//   function createStartMarker(lat, lng) {
//     if (localStorage.getItem(BG_KEY) === 'simple') {
//       return L.marker([lat, lng]).addTo(map);
//     }
//     return L.marker([lat, lng], {
//       icon: L.icon({
//         iconUrl: 'images/start.png',
//         iconSize: [40, 40],
//         iconAnchor: [20, 40]
//       })
//     }).addTo(map);
//   }

//   function createGoalMarker(lat, lng) {
//     if (localStorage.getItem(BG_KEY) === 'simple') {
//       return L.marker([lat, lng]).addTo(map);
//     }
//     return L.marker([lat, lng], {
//       icon: L.icon({
//         iconUrl: 'images/goal.png',
//         iconSize: [40, 40],
//         iconAnchor: [20, 40]
//       })
//     }).addTo(map);
//   }

//   startNavBtn.addEventListener('click', () => {
//     const address = addressInput.value.trim();
//     if (!goal) {
//       showToast('目的地を設定してください');
//       return;
//     }
    
//     isFollowLocation = true;

//     showNavScreen();
//     map.invalidateSize();

//     if (gpsWatchId) return;

//     gpsWatchId = navigator.geolocation.watchPosition(pos => {
//       start.lat = pos.coords.latitude;
//       start.lng = pos.coords.longitude;

//       if (startMarker) map.removeLayer(startMarker);
//       startMarker = createStartMarker(start.lat, start.lng);

//       if (isFollowLocation) {
//         map.setView([start.lat, start.lng], map.getZoom());
//       }

//       if (goal) drawRoute();
//       checkArrived();
//     });
//   });


//   stopNavBtn.addEventListener('click', () => {
//     if (gpsWatchId) {
//       navigator.geolocation.clearWatch(gpsWatchId);
//       gpsWatchId = null;
//     }

//     isFollowLocation = false;

//     if (routeLayer) map.removeLayer(routeLayer);

//     if (goalMarker) {
//       map.removeLayer(goalMarker);
//       goalMarker = null;
//     }
    
//     goal =null;
//     updateStartNavButton();

//     showStartScreen();
//     showToast('ナビを終了しました');
//   });


//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; OpenStreetMap contributors'
//   }).addTo(map);

//   document.querySelectorAll('.mode-select button').forEach(btn => {
//     btn.addEventListener('click', () => {
//       document.querySelectorAll('.mode-select button')
//         .forEach(b => b.classList.remove('active'));
//       btn.classList.add('active');
//       currentMode = btn.dataset.mode;
//       if (goal) drawRoute();
//     });
//   });

//   function drawRoute() {
//     const profile = currentMode === 'car' ? 'driving' : 'foot';
//     fetch(
//       `https://router.project-osrm.org/route/v1/${profile}/` +
//       `${start.lng},${start.lat};${goal.lng},${goal.lat}?overview=full&geometries=geojson`
//     )
//       .then(r => r.json())
//       .then(data => {
//         if (!data.routes?.[0]) return;
//         if (routeLayer) map.removeLayer(routeLayer);
//         routeLayer = L.geoJSON(data.routes[0].geometry, {
//           style: { color: '#ffcc66', weight: 6 , opacity: 0.85}
//         }).addTo(map);
//       });
//   }

//   function checkArrived() {
//     if (!goal || !start) return;

//     const d = map.distance(
//       [start.lat, start.lng],
//       [goal.lat, goal.lng]
//     );

//     if (d < 20) {
//       showToast('目的地に到着しました');

//       // GPS停止
//       navigator.geolocation.clearWatch(gpsWatchId);
//       gpsWatchId = null;

//       isFollowLocation = false;

//       // ルート削除
//       if (routeLayer) {
//         map.removeLayer(routeLayer);
//         routeLayer = null;
//       }

//       // 画面を起動画面に戻す
//       showStartScreen();

//       goal = null;
//       updateStartNavButton();
//     }
//   }

//   /* ==================================================
//   目的地設定
//   ================================================== */
//   function setGoal(lat, lng) {
//     goal = { lat, lng };

//     // 既存のゴールマーカーを削除
//     if (goalMarker) {
//         map.removeLayer(goalMarker);
//     }

//     // 新しいゴールマーカーを作成
//     goalMarker = createGoalMarker(goal.lat, goal.lng);

//     // ルート描画
//     if (gpsWatchId) {
//         drawRoute();
//     }
//   }
//   updateStartNavButton();

//   /* ==================================================
//   住所検索
//   ================================================== */
//   function searchAddress(address) {
//     if (!address) {
//       showToast('住所を入力してください');
//       return;
//     }

//     fetch(
//       `https://nominatim.openstreetmap.org/search?` +
//       `format=json&q=${encodeURIComponent(address)}`
//     )
//       .then(res => res.json())
//       .then(data => {
//         if (!data || data.length === 0) {
//           showToast('住所が見つかりません');
//           return;
//         }

//         const lat = parseFloat(data[0].lat);
//         const lng = parseFloat(data[0].lon);

//         setGoal(lat, lng);
//         showToast('目的地を設定しました');
//       })
//       .catch(() => {
//         showToast('検索に失敗しました');
//       });
//   }

// });

console.log('map.js loaded');

document.addEventListener('DOMContentLoaded', () => {

  /* ==============================
     DOM
  ============================== */
  const startScreen = document.getElementById('startScreen');
  const addressInput = document.getElementById('addressInput');
  const startNavBtn = document.getElementById('startNav');
  const stopNavBtn = document.getElementById('stopNav');
  const toast = document.getElementById('toast');

  const settingsBtn = document.getElementById('settingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  const settingsClose = document.getElementById('settingsClose');
  const bgToggle = document.getElementById('bgToggle');

  const voiceBtn = document.getElementById('voiceSelectBtn');
  const voiceList = document.getElementById('voiceSelectList');
  const voiceLabel = document.getElementById('voiceSelectLabel');

  const navVoiceBtn = document.getElementById('navVoiceSelectBtn');
  const navVoiceList = document.getElementById('navVoiceSelectList');
  const navVoiceLabel = document.getElementById('navVoiceSelectLabel');

  /* ==============================
     状態
  ============================== */
  let goal = null;
  let map = null;
  let gpsWatchId = null;
  let routeLayer = null;
  let startMarker = null;
  let goalMarker = null;

  let start = { lat: 35.681236, lng: 139.767125 };
  let currentMode = 'foot';
  let isFollowLocation = true;

  /* ==============================
     Toast
  ============================== */
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  /* ==============================
     Screen
  ============================== */
  function showStartScreen() {
    document.body.classList.add('is-start');
    document.body.classList.remove('is-nav');
  }

  function showNavScreen() {
    document.body.classList.add('is-nav');
    document.body.classList.remove('is-start');

    // ★ Leaflet 初期化はここで行う
    if (!map) initMap();
    map.invalidateSize();
  }

  showStartScreen();

  /* ==============================
     Map init（重要）
  ============================== */
  function initMap() {
    map = L.map('map').setView([start.lat, start.lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  }

  /* ==============================
     Start button enable
  ============================== */
  function updateStartNavButton() {
    const enabled = !!goal;
    startNavBtn.disabled = !enabled;
    startNavBtn.classList.toggle('disabled', !enabled);
  }

  /* ==============================
     Address search
  ============================== */
  let addressTimer = null;

  addressInput.addEventListener('input', () => {
    clearTimeout(addressTimer);
    const v = addressInput.value.trim();

    if (!v) {
      goal = null;
      updateStartNavButton();
      return;
    }

    addressTimer = setTimeout(() => searchAddress(v), 600);
  });

  function searchAddress(address) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .then(r => r.json())
      .then(data => {
        if (!data?.length) {
          showToast('住所が見つかりません');
          return;
        }

        const lat = Number(data[0].lat);
        const lng = Number(data[0].lon);

        setGoal(lat, lng);
        showToast('目的地を設定しました');
      })
      .catch(() => showToast('検索に失敗しました'));
  }

  function setGoal(lat, lng) {
    goal = { lat, lng };
    updateStartNavButton();

    if (goalMarker && map) map.removeLayer(goalMarker);
    if (map) {
      goalMarker = L.marker([lat, lng]).addTo(map);
    }
  }

  /* ==============================
     Navigation start
  ============================== */
  startNavBtn.addEventListener('click', () => {
    if (!goal) {
      showToast('目的地を設定してください');
      return;
    }

    showNavScreen();

    gpsWatchId = navigator.geolocation.watchPosition(pos => {
      start.lat = pos.coords.latitude;
      start.lng = pos.coords.longitude;

      if (startMarker) map.removeLayer(startMarker);
      startMarker = L.marker([start.lat, start.lng]).addTo(map);

      if (isFollowLocation) {
        map.setView([start.lat, start.lng], map.getZoom());
      }

      drawRoute();
      checkArrived();
    });
  });

  /* ==============================
     Stop
  ============================== */
  stopNavBtn.addEventListener('click', () => {
    if (gpsWatchId) {
      navigator.geolocation.clearWatch(gpsWatchId);
      gpsWatchId = null;
    }

    if (routeLayer) map.removeLayer(routeLayer);
    if (goalMarker) map.removeLayer(goalMarker);

    goal = null;
    updateStartNavButton();
    showStartScreen();
    showToast('ナビを終了しました');
  });

  /* ==============================
     Route
  ============================== */
  function drawRoute() {
    if (!goal || !map) return;

    const profile = currentMode === 'car' ? 'driving' : 'foot';

    fetch(`https://router.project-osrm.org/route/v1/${profile}/${start.lng},${start.lat};${goal.lng},${goal.lat}?overview=full&geometries=geojson`)
      .then(r => r.json())
      .then(data => {
        if (!data.routes?.[0]) return;
        if (routeLayer) map.removeLayer(routeLayer);

        routeLayer = L.geoJSON(data.routes[0].geometry, {
          style: { color: '#ffcc66', weight: 6, opacity: 0.85 }
        }).addTo(map);
      });
  }

  function checkArrived() {
    if (!goal || !map) return;

    const d = map.distance(
      [start.lat, start.lng],
      [goal.lat, goal.lng]
    );

    if (d < 20) {
      showToast('目的地に到着しました');
      stopNavBtn.click();
    }
  }

});
