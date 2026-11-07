/**
 * ============================================================================
 * THE CORE SIX - MAIN APPLICATION SCRIPT
 * Layers: Session/Auth, UI & Navigation, Event/Album Handlers, Lightbox, Firebase
 * ============================================================================
 */

let eventsData = JSON.parse(JSON.stringify(baseEventsData));
let memberPhotosData = JSON.parse(JSON.stringify(baseMemberPhotosData));
let guestbookNotes = [];

// Lightbox rotation & flip state
let currentLightboxRotation = 0;
let currentLightboxFlippedH = false;

// Active gallery filters & state
let currentMemberName = "";
let currentMemberFilter = "all";

/* ----------------------------------------------------------------------------
   1. SESSION & AUTHENTICATION LAYER
   ---------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  // Check existing session
  const savedSession = localStorage.getItem("coreSixSession");
  if (savedSession) {
    try {
      const data = JSON.parse(savedSession);
      const now = new Date().getTime();

      // Valid if less than 3 hours
      if (now < data.expiry) {
        unlockInterfaceDirectly(data.memberName || "Thành viên");
      } else {
        localStorage.removeItem("coreSixSession");
      }
    } catch (e) {
      localStorage.removeItem("coreSixSession");
    }
  }

  // Render initial contents
  renderEvents();
  renderAllPhotosGallery();
  renderVideosGallery();
});

function unlockInterfaceDirectly(memberName) {
  const lockScreen = document.getElementById("lock-screen");
  const mainWebsite = document.getElementById("main-website");
  const welcomeBadge = document.getElementById("welcome-badge");

  if (welcomeBadge && memberName) {
    welcomeBadge.textContent = `Chào ${memberName} ✨`;
  }

  if (lockScreen && mainWebsite) {
    lockScreen.style.display = "none";
    mainWebsite.classList.remove("pointer-events-none");
    mainWebsite.style.opacity = 1;

    if (window.initFirebaseSync) {
      window.initFirebaseSync();
    }
  }
}

function handleLogin() {
  const inputField = document.getElementById("birthdate-input");
  const enteredDate = inputField ? inputField.value.trim() : "";

  if (!enteredDate) {
    showToast("Vui lòng nhập ngày tháng năm sinh!");
    return;
  }

  if (validBirthDates.hasOwnProperty(enteredDate)) {
    const memberName = validBirthDates[enteredDate];
    const welcomeBadge = document.getElementById("welcome-badge");
    if (welcomeBadge) {
      welcomeBadge.textContent = `Chào ${memberName} ✨`;
    }
    showToast(`Xác thực thành công! Chào mừng ${memberName} 🌿`);

    // Set 3-hour expiry
    const sessionData = {
      unlocked: true,
      memberName: memberName,
      expiry: new Date().getTime() + 3 * 60 * 60 * 1000,
    };
    localStorage.setItem("coreSixSession", JSON.stringify(sessionData));

    const lockScreen = document.getElementById("lock-screen");
    const mainWebsite = document.getElementById("main-website");

    gsap.to(lockScreen, {
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        lockScreen.style.display = "none";
        mainWebsite.classList.remove("pointer-events-none");
        gsap.to(mainWebsite, { opacity: 1, duration: 0.8 });

        if (window.initFirebaseSync) {
          window.initFirebaseSync();
        }
      },
    });
  } else {
    showToast("Ngày sinh không chính xác! Không thể truy cập.");
    gsap.fromTo(
      "#birthdate-input",
      { x: -12 },
      { x: 12, duration: 0.1, yoyo: true, repeat: 4 }
    );
  }
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  gsap.to(toast, { opacity: 1, y: 10, duration: 0.3 });
  setTimeout(() => {
    gsap.to(toast, { opacity: 0, y: 0, duration: 0.3 });
  }, 2600);
}

/* ----------------------------------------------------------------------------
   2. HOMEPAGE & EVENTS ALBUM LAYER
   ---------------------------------------------------------------------------- */
function renderEvents() {
  const eventsContainer = document.getElementById("events-container");
  if (!eventsContainer) return;
  eventsContainer.innerHTML = "";

  eventsData.forEach((event) => {
    const card = document.createElement("div");
    card.className =
      "earthy-card rounded-3xl overflow-hidden shadow-xl cursor-pointer group hover:border-terracotta/50 transition-all duration-300";
    card.onclick = () => {
      if (event.isBirthdayEvent) {
        openBirthdaySubModal();
      } else {
        openEventModal(event.id);
      }
    };
    card.innerHTML = `
      <div class="relative overflow-hidden aspect-[16/10] bg-espresso/10">
        <img src="${event.cover}" alt="${event.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
        <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-espresso/70 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-warmCream uppercase tracking-wider">
          <i class="fa-solid fa-images mr-1"></i> ${event.photos ? event.photos.length : 0} Khoảnh Khắc ${event.isBirthdayEvent ? "(Sub-Albums)" : ""}
        </span>
        <div class="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-terracotta text-white text-xs font-semibold shadow-md">
          Xem Album <i class="fa-solid fa-arrow-right ml-1"></i>
        </div>
      </div>
      <div class="p-5">
        <div class="text-xs text-terracotta font-mono font-semibold mb-1">
          <i class="fa-regular fa-calendar mr-1.5"></i>${event.date}
        </div>
        <h3 class="text-xl font-bold text-espresso mb-2 group-hover:text-terracotta transition-colors font-serif">
          ${event.title}
        </h3>
        <p class="text-espresso/80 text-xs line-clamp-2 font-light">${event.description}</p>
      </div>
    `;
    eventsContainer.appendChild(card);
  });
}

function openEventModal(eventId) {
  const event = eventsData.find((e) => e.id === eventId);
  if (!event) return;

  const eventModal = document.getElementById("event-modal");
  const modalEventTitle = document.getElementById("modal-event-title");
  const modalEventDate = document.getElementById("modal-event-date");
  const modalEventDesc = document.getElementById("modal-event-desc");
  const modalEventCount = document.getElementById("modal-event-count");
  const modalAlbumGrid = document.getElementById("modal-album-grid");

  if (modalEventTitle) modalEventTitle.textContent = event.title;
  if (modalEventDate) modalEventDate.textContent = event.date;
  if (modalEventDesc) modalEventDesc.textContent = event.description;
  if (modalEventCount) modalEventCount.textContent = `${event.photos ? event.photos.length : 0} ảnh`;

  if (modalAlbumGrid) {
    modalAlbumGrid.innerHTML = "";
    (event.photos || []).forEach((photoUrl, index) => {
      const photoCard = document.createElement("div");
      photoCard.className =
        "aspect-square rounded-2xl overflow-hidden bg-espresso/10 cursor-pointer group shadow-md opacity-0 scale-95";
      photoCard.innerHTML = `
        <img src="${photoUrl}" alt="Album photo ${index + 1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
      `;
      photoCard.onclick = () => openLightbox(photoUrl, `${event.title} - Ảnh ${index + 1}`);
      modalAlbumGrid.appendChild(photoCard);
    });
  }

  if (eventModal) {
    eventModal.classList.remove("pointer-events-none");
    gsap.to(eventModal, { opacity: 1, duration: 0.3 });
    document.body.style.overflow = "hidden";

    if (modalAlbumGrid && modalAlbumGrid.children.length > 0) {
      gsap.to(modalAlbumGrid.children, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.02,
        ease: "power2.out",
        delay: 0.1,
      });
    }
  }
}

function closeEventModal() {
  const eventModal = document.getElementById("event-modal");
  if (!eventModal) return;
  gsap.to(eventModal, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      eventModal.classList.add("pointer-events-none");
      document.body.style.overflow = "auto";
    },
  });
}

function openBirthdaySubModal() {
  const birthdaySubModal = document.getElementById("birthday-submodal");
  const birthdaySubalbumsList = document.getElementById("birthday-subalbums-list");
  if (!birthdaySubalbumsList) return;

  birthdaySubalbumsList.innerHTML = "";

  const subAlbumsData = [
    {
      name: "Nguyễn Hương Giang",
      year: "2025",
      cover: (baseMemberPhotosData["Nguyễn Hương Giang"] && baseMemberPhotosData["Nguyễn Hương Giang"][0]) ? baseMemberPhotosData["Nguyễn Hương Giang"][0].url : ourPhotosList[0],
    },
    {
      name: "Đỗ Hữu Tuân",
      year: "2025",
      cover: (baseMemberPhotosData["Đỗ Hữu Tuân"] && baseMemberPhotosData["Đỗ Hữu Tuân"][0]) ? baseMemberPhotosData["Đỗ Hữu Tuân"][0].url : ourPhotosList[1],
    },
    {
      name: "Chu Thị Lan Anh",
      year: "2025",
      cover: (baseMemberPhotosData["Chu Thị Lan Anh"] && baseMemberPhotosData["Chu Thị Lan Anh"][0]) ? baseMemberPhotosData["Chu Thị Lan Anh"][0].url : ourPhotosList[2],
    },
    {
      name: "Nguyễn Văn Đạt",
      year: "2025",
      cover: (baseMemberPhotosData["Nguyễn Văn Đạt"] && baseMemberPhotosData["Nguyễn Văn Đạt"][0]) ? baseMemberPhotosData["Nguyễn Văn Đạt"][0].url : ourPhotosList[3],
    },
    {
      name: "Nguyễn Tuấn Anh",
      year: "2025",
      cover: (baseMemberPhotosData["Nguyễn Tuấn Anh"] && baseMemberPhotosData["Nguyễn Tuấn Anh"][0]) ? baseMemberPhotosData["Nguyễn Tuấn Anh"][0].url : ourPhotosList[4],
    },
    {
      name: "Phan Lạc Quốc Anh",
      year: "2025",
      cover: (baseMemberPhotosData["Phan Lạc Quốc Anh"] && baseMemberPhotosData["Phan Lạc Quốc Anh"][0]) ? baseMemberPhotosData["Phan Lạc Quốc Anh"][0].url : ourPhotosList[5],
    },
  ];

  subAlbumsData.forEach((sub) => {
    const card = document.createElement("div");
    card.className =
      "earthy-card rounded-2xl overflow-hidden shadow-lg cursor-pointer group hover:border-terracotta transition";
    card.onclick = () => {
      closeBirthdaySubModal();
      openMemberGallery(sub.name);
    };
    card.innerHTML = `
      <div class="relative aspect-video bg-espresso/10 overflow-hidden">
        <img src="${sub.cover}" alt="${sub.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
        <span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-espresso/70 text-warmCream text-[10px] font-mono font-semibold">Năm ${sub.year}</span>
      </div>
      <div class="p-4">
        <h4 class="font-bold text-espresso font-serif text-base group-hover:text-terracotta transition">Sinh nhật ${sub.name}</h4>
        <p class="text-xs text-espresso/70 font-light mt-0.5">Bộ sưu tập ảnh kỷ niệm sinh nhật tuổi 20.</p>
      </div>
    `;
    birthdaySubalbumsList.appendChild(card);
  });

  if (birthdaySubModal) {
    birthdaySubModal.classList.remove("pointer-events-none");
    gsap.to(birthdaySubModal, { opacity: 1, duration: 0.3 });
    document.body.style.overflow = "hidden";
  }
}

function closeBirthdaySubModal() {
  const birthdaySubModal = document.getElementById("birthday-submodal");
  if (!birthdaySubModal) return;
  gsap.to(birthdaySubModal, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      birthdaySubModal.classList.add("pointer-events-none");
      document.body.style.overflow = "auto";
    },
  });
}

/* ----------------------------------------------------------------------------
   3. "ALL PHOTOS" GALLERY LAYER (Kho Ảnh Chung & Tất Cả Mọi Người)
   ---------------------------------------------------------------------------- */
let currentAllPhotosFilter = "all";

function setAllPhotosFilter(filterTag, btn) {
  currentAllPhotosFilter = filterTag;
  const filterBtns = document.querySelectorAll("#all-photos-filter-buttons .all-filter-btn");
  filterBtns.forEach((b) => {
    b.classList.remove("bg-terracotta", "text-white");
    b.classList.add("bg-white/70", "text-espresso/80");
  });
  if (btn) {
    btn.classList.add("bg-terracotta", "text-white");
    btn.classList.remove("bg-white/70", "text-espresso/80");
  }
  renderAllPhotosGallery();
}

function renderAllPhotosGallery() {
  const container = document.getElementById("photoContainer");
  const countBadge = document.getElementById("all-photos-count");
  if (!container) return;

  const dataset = (typeof allMemoriesList !== "undefined" && allMemoriesList.length > 0)
    ? allMemoriesList
    : ourPhotosList.map((url, i) => ({ url, owner: "Kỷ niệm chung (Our)", badge: "Chung", tag: "our" }));

  const filtered = currentAllPhotosFilter === "all"
    ? dataset
    : dataset.filter((item) => item.tag === currentAllPhotosFilter);

  container.innerHTML = "";
  if (countBadge) {
    countBadge.textContent = `${filtered.length} ảnh`;
  }

  filtered.forEach((photo, idx) => {
    const item = document.createElement("div");
    item.className = "photo-grid-item group";
    item.onclick = () => openLightbox(photo.url, `${photo.owner} - Ảnh #${idx + 1}`);
    item.innerHTML = `
      <img src="${photo.url}" alt="${photo.owner}" loading="lazy">
      <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-espresso/85 via-espresso/40 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end text-[11px] text-white">
        <span class="truncate font-light">${photo.owner}</span>
        <span class="px-1.5 py-0.5 rounded bg-terracotta/80 text-[9px] font-mono font-semibold">${photo.badge || "Ảnh"}</span>
      </div>
    `;
    container.appendChild(item);
  });
}

/* ----------------------------------------------------------------------------
   3.1. VIDEOS GALLERY LAYER (Trình chiếu tối ưu 20+ Thước phim)
   ---------------------------------------------------------------------------- */
let currentVideoFilter = "all";

function setVideoFilter(category, btn) {
  currentVideoFilter = category;
  const filterBtns = document.querySelectorAll("#video-filter-buttons .video-filter-btn");
  filterBtns.forEach((b) => {
    b.classList.remove("bg-terracotta", "text-white");
    b.classList.add("bg-white/70", "text-espresso/80");
  });
  if (btn) {
    btn.classList.add("bg-terracotta", "text-white");
    btn.classList.remove("bg-white/70", "text-espresso/80");
  }
  renderVideosGallery();
}

function renderVideosGallery() {
  const container = document.getElementById("videoContainer");
  const countBadge = document.getElementById("videos-count-badge");
  if (!container) return;

  const dataset = (typeof baseVideosList !== "undefined") ? baseVideosList : [];

  const filtered = currentVideoFilter === "all"
    ? dataset
    : dataset.filter((v) => v.category === currentVideoFilter);

  if (countBadge) {
    countBadge.textContent = `${filtered.length} Video`;
  }

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-espresso/60 text-sm italic bg-white/40 rounded-2xl border border-espresso/10">
        Chưa có video nào trong danh mục này.
      </div>
    `;
    return;
  }

  filtered.forEach((vid) => {
    const card = document.createElement("div");
    card.className = "video-card group";

    let mediaHtml = "";
    if (vid.src) {
      if (vid.src.includes("youtube.com") || vid.src.includes("youtu.be")) {
        // Embed youtube
        let embedUrl = vid.src;
        if (vid.src.includes("watch?v=")) {
          embedUrl = vid.src.replace("watch?v=", "embed/");
        } else if (vid.src.includes("youtu.be/")) {
          embedUrl = vid.src.replace("youtu.be/", "www.youtube.com/embed/");
        }
        mediaHtml = `<iframe src="${embedUrl}" title="${vid.title}" allowfullscreen></iframe>`;
      } else {
        // Local MP4 or direct video url
        mediaHtml = `
          <video controls preload="metadata" poster="${vid.poster || ''}">
            <source src="${vid.src}" type="video/mp4">
            Trình duyệt của bạn không hỗ trợ phát video này.
          </video>
        `;
      }
    } else {
      // Placeholder ready for upload
      mediaHtml = `
        <div class="w-full h-full flex flex-col items-center justify-center text-white/70 p-4 text-center select-none" style="background: linear-gradient(135deg, #2D2C2A 0%, #3d3b38 100%);">
          <div class="w-12 h-12 rounded-full bg-terracotta/90 text-white flex items-center justify-center text-lg shadow-lg mb-2 group-hover:scale-110 group-hover:bg-terracotta transition transform duration-300">
            <i class="fa-solid fa-play ml-0.5"></i>
          </div>
          <span class="text-[11px] font-mono text-warmCream tracking-wider">Video #${vid.id < 10 ? '0' + vid.id : vid.id} • 16:9 HD</span>
          <span class="text-[10px] text-white/50 mt-0.5">Chưa gắn link file</span>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="video-player-frame">
        ${mediaHtml}
        <div class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-espresso/80 backdrop-blur-sm text-[10px] text-warmCream font-mono font-semibold pointer-events-none">
          #${vid.id < 10 ? '0' + vid.id : vid.id}
        </div>
        ${vid.category ? `
          <div class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-terracotta/90 text-[10px] text-white font-mono font-semibold pointer-events-none">
            ${vid.category}
          </div>
        ` : ''}
      </div>
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[11px] font-mono text-terracotta font-semibold mb-1">
            <span>${vid.category || 'The Core Six'}</span>
            <span class="text-espresso/50">${vid.date || ''}</span>
          </div>
          <h4 class="text-sm sm:text-base font-bold text-espresso font-serif line-clamp-1 group-hover:text-terracotta transition">
            ${vid.title}
          </h4>
          <p class="text-xs text-espresso/75 font-light mt-1 line-clamp-2 leading-relaxed">
            ${vid.desc}
          </p>
        </div>
        <div class="mt-3 pt-2.5 border-t border-espresso/10 flex items-center justify-between text-[11px] text-espresso/60">
          <span><i class="fa-solid fa-clapperboard mr-1 text-terracotta"></i>${vid.src ? 'Sẵn sàng phát' : 'Đang chờ cập nhật'}</span>
          <span class="font-mono text-espresso/50">Core Six 🎬</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/* ----------------------------------------------------------------------------
   4. MEMBER PERSONAL GALLERIES LAYER
   ---------------------------------------------------------------------------- */
function openMemberGallery(memberName) {
  closeInfoModal();
  closeBirthdaySubModal();
  currentMemberName = memberName;
  currentMemberFilter = "all";

  const memberSearchInput = document.getElementById("member-search-input");
  if (memberSearchInput) memberSearchInput.value = "";

  const filterBtns = document.querySelectorAll("#member-filter-buttons .filter-btn");
  filterBtns.forEach((b) => {
    b.classList.remove("bg-terracotta", "text-white");
    b.classList.add("bg-white/70", "text-espresso/80");
  });
  if (filterBtns[0]) {
    filterBtns[0].classList.add("bg-terracotta", "text-white");
    filterBtns[0].classList.remove("bg-white/70", "text-espresso/80");
  }

  renderMemberPhotos();

  const memberModal = document.getElementById("member-modal");
  if (memberModal) {
    memberModal.classList.remove("pointer-events-none");
    gsap.to(memberModal, { opacity: 1, duration: 0.3 });
    document.body.style.overflow = "hidden";
  }
}

function setMemberFilter(filter, btn) {
  currentMemberFilter = filter;
  const filterBtns = document.querySelectorAll("#member-filter-buttons .filter-btn");
  filterBtns.forEach((b) => {
    b.classList.remove("bg-terracotta", "text-white");
    b.classList.add("bg-white/70", "text-espresso/80");
  });
  btn.classList.add("bg-terracotta", "text-white");
  btn.classList.remove("bg-white/70", "text-espresso/80");

  renderMemberPhotos();
}

function filterMemberPhotos() {
  renderMemberPhotos();
}

function renderMemberPhotos() {
  const modalMemberName = document.getElementById("modal-member-name");
  const modalMemberCount = document.getElementById("modal-member-count");
  const modalMemberGrid = document.getElementById("modal-member-grid");
  const memberSearchInput = document.getElementById("member-search-input");

  const rawPhotos = memberPhotosData[currentMemberName] || [];
  const searchTerm = memberSearchInput ? memberSearchInput.value.toLowerCase().trim() : "";

  const filtered = rawPhotos.filter((item) => {
    const matchesFilter =
      currentMemberFilter === "all" ||
      item.year === currentMemberFilter ||
      item.topic === currentMemberFilter;
    const matchesSearch =
      item.caption.toLowerCase().includes(searchTerm) ||
      item.year.toLowerCase().includes(searchTerm) ||
      item.topic.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  if (modalMemberName) modalMemberName.textContent = currentMemberName;
  if (modalMemberCount) modalMemberCount.textContent = `${filtered.length} ảnh`;

  if (!modalMemberGrid) return;
  modalMemberGrid.innerHTML = "";

  if (filtered.length === 0) {
    modalMemberGrid.innerHTML = `<div class="col-span-full py-12 text-center text-espresso/60 text-sm italic bg-white/40 rounded-2xl border border-espresso/10">Không tìm thấy khoảnh khắc phù hợp với bộ lọc hoặc từ khóa.</div>`;
    return;
  }

  filtered.forEach((item, index) => {
    const photoCard = document.createElement("div");
    photoCard.className =
      "aspect-square rounded-2xl overflow-hidden bg-espresso/10 cursor-pointer group shadow-md opacity-0 scale-95 relative";
    photoCard.innerHTML = `
      <img src="${item.url}" alt="${currentMemberName} photo ${index + 1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
      <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-espresso/80 via-espresso/40 to-transparent p-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end text-[11px] text-white">
        <span class="truncate font-light">${item.caption}</span>
        <span class="font-mono text-warmCream font-semibold">${item.year}</span>
      </div>
    `;
    photoCard.onclick = () => openLightbox(item.url, `${currentMemberName} - ${item.caption} (${item.year})`);
    modalMemberGrid.appendChild(photoCard);
  });

  gsap.to(modalMemberGrid.children, {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    stagger: 0.02,
    ease: "power2.out",
    delay: 0.1,
  });
}

function closeMemberModal() {
  const memberModal = document.getElementById("member-modal");
  if (!memberModal) return;
  gsap.to(memberModal, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      memberModal.classList.add("pointer-events-none");
      document.body.style.overflow = "auto";
    },
  });
}

/* ----------------------------------------------------------------------------
   5. LIGHTBOX & IMAGE ORIENTATION LAYER (Hỗ trợ xoay / lật nếu ảnh bị ngược)
   ---------------------------------------------------------------------------- */
function openLightbox(url, caption) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");

  if (!lightbox || !lightboxImg) return;

  // Reset transforms
  currentLightboxRotation = 0;
  currentLightboxFlippedH = false;
  applyLightboxTransform();

  lightboxImg.src = url;
  if (lightboxCaption) {
    lightboxCaption.textContent = caption || "Khoảnh khắc thanh xuân";
  }

  lightbox.classList.remove("pointer-events-none");
  gsap.to(lightbox, { opacity: 1, duration: 0.3 });
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  gsap.to(lightbox, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      lightbox.classList.add("pointer-events-none");
      currentLightboxRotation = 0;
      currentLightboxFlippedH = false;
      applyLightboxTransform();
    },
  });
}

function rotateLightbox(deg) {
  currentLightboxRotation = (currentLightboxRotation + deg + 360) % 360;
  applyLightboxTransform();
  showToast(`Đã xoay ảnh ${currentLightboxRotation}° 🔄`);
}

function flipLightboxH() {
  currentLightboxFlippedH = !currentLightboxFlippedH;
  applyLightboxTransform();
  showToast(currentLightboxFlippedH ? "Đã lật gương ngang ảnh" : "Đã đưa về góc lật ban đầu");
}

function applyLightboxTransform() {
  const lightboxImg = document.getElementById("lightbox-img");
  if (!lightboxImg) return;
  const scaleX = currentLightboxFlippedH ? -1 : 1;
  lightboxImg.style.transform = `rotate(${currentLightboxRotation}deg) scaleX(${scaleX})`;
  lightboxImg.style.transition = "transform 0.3s ease";
}

/* ----------------------------------------------------------------------------
   6. GUESTBOOK & CLOUD SYNC LAYER
   ---------------------------------------------------------------------------- */
function renderGuestbook() {
  const container = document.getElementById("guestbook-container");
  if (!container) return;
  container.innerHTML = "";

  if (guestbookNotes.length === 0) {
    container.innerHTML = `<div class="text-center py-6 text-espresso/50 text-xs italic">Chưa có lời nhắn nào. Hãy là người đầu tiên gửi lời chúc! 💌</div>`;
    return;
  }

  guestbookNotes.forEach((note) => {
    const item = document.createElement("div");
    item.className = "bg-white/60 p-4 rounded-2xl border border-espresso/10 shadow-sm";
    item.innerHTML = `
      <div class="flex justify-between items-center mb-1">
        <span class="font-bold text-espresso text-sm">${note.author}</span>
        <span class="text-[10px] font-mono text-espresso/50">${note.date}</span>
      </div>
      <p class="text-espresso/80 text-xs sm:text-sm font-light">${note.message}</p>
    `;
    container.appendChild(item);
  });
}

async function addGuestbookNote() {
  const authorInput = document.getElementById("guestbook-author");
  const messageInput = document.getElementById("guestbook-message");
  const author = authorInput ? authorInput.value.trim() : "";
  const message = messageInput ? messageInput.value.trim() : "";

  if (!author || !message) {
    showToast("Vui lòng nhập tên và nội dung lời nhắn!");
    return;
  }

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

  try {
    showToast("Đang gửi lời nhắn lên Cloud...");
    if (window.addDoc && window.collection && window.db) {
      await window.addDoc(window.collection(window.db, "guestbooks"), {
        author,
        message,
        date: dateStr,
        createdAt: new Date(),
      });
    }

    if (authorInput) authorInput.value = "";
    if (messageInput) messageInput.value = "";
    showToast("Đã gửi lời nhắn lên sổ lưu bút thành công! ✨");
  } catch (error) {
    console.error("Lỗi gửi lưu bút:", error);
    showToast("Có lỗi xảy ra, vui lòng thử lại!");
  }
}

function initGuestbookSync() {
  if (!window.db) return;
  const q = window.query(
    window.collection(window.db, "guestbooks"),
    window.orderBy("createdAt", "desc")
  );
  window.onSnapshot(q, (snapshot) => {
    guestbookNotes = [];
    snapshot.forEach((doc) => {
      guestbookNotes.push({ id: doc.id, ...doc.data() });
    });
    renderGuestbook();
  });
}

function initPhotosSync() {
  if (!window.db) return;
  const q = window.query(
    window.collection(window.db, "photos"),
    window.orderBy("createdAt", "desc")
  );
  window.onSnapshot(q, (snapshot) => {
    eventsData = JSON.parse(JSON.stringify(baseEventsData));
    memberPhotosData = JSON.parse(JSON.stringify(baseMemberPhotosData));

    snapshot.forEach((doc) => {
      const data = doc.data();
      const target = data.target;
      const photoUrl = data.url;
      const caption = data.caption || "Khoảnh khắc thanh xuân";
      const year = data.year || "2026";
      const topic = data.topic || "Du lịch";

      if (target && target.startsWith("event_")) {
        const eventId = parseInt(target.replace("event_", ""));
        const ev = eventsData.find((e) => e.id === eventId);
        if (ev) {
          if (!ev.photos) ev.photos = [];
          ev.photos.unshift(photoUrl);
          if (!ev.cover || ev.cover.startsWith("http")) {
            ev.cover = photoUrl;
          }
        }
      } else if (target && target.startsWith("member_")) {
        const memberName = target.replace("member_", "");
        if (!memberPhotosData[memberName]) {
          memberPhotosData[memberName] = [];
        }
        memberPhotosData[memberName].unshift({
          url: photoUrl,
          year: year,
          topic: topic,
          caption: caption,
        });
      }
    });

    renderEvents();
    if (
      currentMemberName &&
      document.getElementById("member-modal") &&
      !document.getElementById("member-modal").classList.contains("pointer-events-none")
    ) {
      renderMemberPhotos();
    }
  });
}

/* ----------------------------------------------------------------------------
   7. PHOTO UPLOAD LOGIC
   ---------------------------------------------------------------------------- */
function openUploadModal() {
  const uploadModal = document.getElementById("upload-modal");
  if (!uploadModal) return;
  uploadModal.classList.remove("pointer-events-none");
  gsap.to(uploadModal, { opacity: 1, duration: 0.3 });
}

function closeUploadModal() {
  const uploadModal = document.getElementById("upload-modal");
  if (!uploadModal) return;
  gsap.to(uploadModal, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => uploadModal.classList.add("pointer-events-none"),
  });
}

async function handlePhotoUpload() {
  const fileInput = document.getElementById("upload-file-input");
  const captionInput = document.getElementById("upload-caption-input");
  const targetSelect = document.getElementById("upload-target-select");

  const caption = captionInput ? captionInput.value.trim() : "Khoảnh khắc thanh xuân";
  const targetVal = targetSelect ? targetSelect.value : "event_1";

  if (!fileInput.files || fileInput.files.length === 0) {
    showToast("Vui lòng chọn một hình ảnh từ thiết bị!");
    return;
  }

  const file = fileInput.files[0];
  showToast("Đang tải ảnh lên Cloudinary...");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "apqulm69");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/ddru6qfcv/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (!data.secure_url) {
      throw new Error("Không nhận được đường dẫn URL từ Cloudinary");
    }

    const imageUrl = data.secure_url;

    if (window.addDoc && window.collection && window.db) {
      await window.addDoc(window.collection(window.db, "photos"), {
        url: imageUrl,
        caption: caption,
        target: targetVal,
        year: "2026",
        topic: targetVal.startsWith("member_") ? "Chân dung" : "Du lịch",
        createdAt: new Date(),
      });
    }

    fileInput.value = "";
    if (captionInput) captionInput.value = "";
    closeUploadModal();
    showToast("Đã tải ảnh lên và đồng bộ cho cả 6 thành viên! ✨");
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    showToast("Có lỗi xảy ra khi tải ảnh lên Cloudinary!");
  }
}

/* ----------------------------------------------------------------------------
   8. MODALS & UI HELPERS (Game Modal, Info Modal, Navigation)
   ---------------------------------------------------------------------------- */
function showInfoModal() {
  const infoModal = document.getElementById("info-modal");
  if (!infoModal) return;
  infoModal.classList.remove("pointer-events-none");
  gsap.to(infoModal, { opacity: 1, duration: 0.3 });
}

function closeInfoModal() {
  const infoModal = document.getElementById("info-modal");
  if (!infoModal) return;
  gsap.to(infoModal, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => infoModal.classList.add("pointer-events-none"),
  });
}

function showGuestbookFocus() {
  const gb = document.getElementById("guestbook-section");
  if (gb) gb.scrollIntoView({ behavior: "smooth" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToAllPhotos() {
  const el = document.getElementById("all-photos-section");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function scrollToVideoSection() {
  const el = document.getElementById("video-section");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function openGameModal() {
  const modal = document.getElementById("gameModal");
  const content = document.getElementById("gameModalContent");
  if (!modal || !content) return;

  modal.classList.remove("opacity-0", "pointer-events-none");
  content.classList.remove("scale-95");
  content.classList.add("scale-100");
}

function closeGameModal() {
  const modal = document.getElementById("gameModal");
  const content = document.getElementById("gameModalContent");
  if (!modal || !content) return;

  modal.classList.add("opacity-0", "pointer-events-none");
  content.classList.remove("scale-100");
  content.classList.add("scale-95");
}

// Close Game Modal on outer click
document.addEventListener("DOMContentLoaded", () => {
  const gameModal = document.getElementById("gameModal");
  if (gameModal) {
    gameModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeGameModal();
      }
    });
  }
});
