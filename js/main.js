/* ==========================================================================
   المسار الأخضر — ملف الجافاسكربت الموحّد
   يدمج: Toggle تفاصيل الباقة (عضو 2) + فلتر المعرض + فلتر الاختيار
        + نموذج الحجز كامل مع التحقق وحاسبة السعر (عضو 4)
   جميع الأكواد آمنة: تتحقق من وجود العناصر قبل التنفيذ.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* -------- 1) Toggle تفاصيل البرنامج اليومي (Package Details) -------- */
    const toggleButton  = document.getElementById("detail-toggle-btn");
    const extraContent  = document.getElementById("detail-extra-content");
    if (toggleButton && extraContent) {
        toggleButton.addEventListener("click", function () {
            if (extraContent.style.display === "block") {
                extraContent.style.display = "none";
                toggleButton.innerHTML = "👁️ إظهار جدول الأنشطة اليومي التفصيلي";
                toggleButton.style.backgroundColor = "transparent";
                toggleButton.style.color = "var(--color-primary)";
            } else {
                extraContent.style.display = "block";
                toggleButton.innerHTML = "🙈 إخفاء جدول الأنشطة اليومي التفصيلي";
                toggleButton.style.backgroundColor = "var(--color-primary)";
                toggleButton.style.color = "var(--color-background)";
            }
        });
    }

    /* -------- 2) فلتر صفحة المعرض (Gallery) -------- */
    const filterButtons = document.querySelectorAll(".gallery-filters .filter-btn");
    const galleryItems  = document.querySelectorAll(".gallery-grid .gallery-item");
    if (filterButtons.length && galleryItems.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", function () {
                filterButtons.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                const filter = this.getAttribute("data-filter");
                galleryItems.forEach(item => {
                    const cat = item.getAttribute("data-category");
                    item.classList.toggle("hide", !(filter === "all" || cat === filter));
                });
            });
        });
    }

    /* -------- 3) فلتر صفحة الاختيار (Choice) عبر القائمة المنسدلة -------- */
    const destSelect    = document.getElementById("destination-select");
    const choiceCards   = document.querySelectorAll(".choice-card");
    const choiceMessage = document.getElementById("selection-message");
    if (destSelect && choiceCards.length) {
        destSelect.addEventListener("change", function () {
            const val = this.value;
            let visibleCount = 0;
            choiceCards.forEach(card => {
                const match = (val === "all" || card.getAttribute("data-destination") === val);
                card.classList.toggle("choice-hide", !match);
                if (match) visibleCount++;
            });
            if (choiceMessage) {
                if (val === "all") {
                    choiceMessage.className = "choice-msg-hidden";
                    choiceMessage.textContent = "";
                } else {
                    choiceMessage.className = "choice-msg-visible";
                    choiceMessage.textContent = `تم عرض ${visibleCount} وجهة مطابقة لاختيارك ✨`;
                }
            }
        });
    }

    /* -------- 4) نموذج الحجز (Booking) — عضو 4 -------- */
    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
        const packagePrices = { bahah:1500, jeddah:2200, ahsa:1800, abha:3000, ula:2800 };
        const fullNameInput      = document.getElementById("full-name");
        const emailInput         = document.getElementById("email");
        const phoneInput         = document.getElementById("phone");
        const destinationSelect  = document.getElementById("destination");
        const travelersInput     = document.getElementById("travelers");
        const travelDateInput    = document.getElementById("travel-date");
        const totalPriceDisplay  = document.getElementById("total-price");
        const priceDetailsDisplay= document.getElementById("price-details");
        const successMessageDisp = document.getElementById("success-message");

        function showFieldError(field, message) {
            const map = {
                fullName: ["error-name", fullNameInput],
                email: ["error-email", emailInput],
                phone: ["error-phone", phoneInput],
                destination: ["error-destination", destinationSelect],
                travelers: ["error-travelers", travelersInput],
                travelDate: ["error-date", travelDateInput]
            };
            const [errId, inp] = map[field] || [];
            const err = document.getElementById(errId);
            if (inp && err) {
                inp.classList.add("invalid");
                err.innerText = message;
                err.style.display = "block";
            }
            return false;
        }
        function clearFieldError(field) {
            const map = {
                fullName: ["error-name", fullNameInput],
                email: ["error-email", emailInput],
                phone: ["error-phone", phoneInput],
                destination: ["error-destination", destinationSelect],
                travelers: ["error-travelers", travelersInput],
                travelDate: ["error-date", travelDateInput]
            };
            const [errId, inp] = map[field] || [];
            const err = document.getElementById(errId);
            if (inp && err) {
                inp.classList.remove("invalid");
                err.innerText = "";
                err.style.display = "none";
            }
            return true;
        }

        function validateName() {
            const v = fullNameInput.value.trim();
            if (!v) return showFieldError("fullName","⚠ الرجاء إدخال الاسم الكامل، هذا الحقل إلزامي.");
            if (v.length < 3) return showFieldError("fullName","⚠ يجب أن يكون الاسم 3 أحرف على الأقل.");
            return clearFieldError("fullName");
        }
        function validateEmail() {
            const v = emailInput.value.trim();
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!v) return showFieldError("email","⚠ البريد الإلكتروني مطلوب للتواصل وتأكيد الحجز.");
            if (!re.test(v)) return showFieldError("email","⚠ صيغة البريد الإلكتروني غير صحيحة (مثال: name@domain.com).");
            return clearFieldError("email");
        }
        function validatePhone() {
            const v = phoneInput.value.trim();
            const re = /^(05|00966|\+966)[0-9]{7,10}$/;
            if (!v) return showFieldError("phone","⚠ رقم الهاتف إلزامي للتواصل الفوري.");
            if (!re.test(v)) return showFieldError("phone","⚠ رقم غير صحيح. يجب أن يبدأ بـ 05 أو مفتاح الدولة ومكون من 9-12 رقماً.");
            return clearFieldError("phone");
        }
        function validateDestination() {
            if (!destinationSelect.value) return showFieldError("destination","⚠ يجب اختيار إحدى الوجهات البيئية لإتمام الحجز.");
            return clearFieldError("destination");
        }
        function validateTravelers() {
            const v = parseInt(travelersInput.value);
            if (isNaN(v) || v < 1) return showFieldError("travelers","⚠ يجب أن يكون هناك مسافر واحد على الأقل.");
            if (v > 20) return showFieldError("travelers","⚠ الحد الأقصى للحجز الإلكتروني الموحد هو 20 مسافراً.");
            return clearFieldError("travelers");
        }
        function validateDate() {
            const v = travelDateInput.value;
            if (!v) return showFieldError("travelDate","⚠ الرجاء اختيار تاريخ السفر المتوقع.");
            const sel = new Date(v); const today = new Date(); today.setHours(0,0,0,0);
            if (sel <= today) return showFieldError("travelDate","⚠ خطأ! يجب اختيار تاريخ في المستقبل (ابتداءً من الغد).");
            return clearFieldError("travelDate");
        }
        function calculateTotalPrice() {
            const dest = destinationSelect.value;
            const trav = parseInt(travelersInput.value);
            if (dest && !isNaN(trav) && trav >= 1 && trav <= 20) {
                const per = packagePrices[dest];
                const total = per * trav;
                totalPriceDisplay.innerText = total.toLocaleString("ar-SA") + " ر.س";
                priceDetailsDisplay.innerText = `(${per.toLocaleString("ar-SA")} ر.س × ${trav} مسافرين)`;
            } else {
                totalPriceDisplay.innerText = "0 ر.س";
                priceDetailsDisplay.innerText = "(الرجاء تحديد الوجهة وعدد المسافرين لحساب السعر تلقائياً)";
            }
        }

        destinationSelect.addEventListener("change", () => { validateDestination(); calculateTotalPrice(); });
        travelersInput.addEventListener("input", () => { validateTravelers(); calculateTotalPrice(); });
        fullNameInput.addEventListener("input", validateName);
        emailInput.addEventListener("input", validateEmail);
        phoneInput.addEventListener("input", validatePhone);
        travelDateInput.addEventListener("change", validateDate);

        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const ok = validateName() & validateEmail() & validatePhone()
                     & validateDestination() & validateTravelers() & validateDate();
            if (ok) {
                successMessageDisp.style.display = "block";
                bookingForm.reset();
                totalPriceDisplay.innerText = "0 ر.س";
                priceDetailsDisplay.innerText = "(الرجاء تحديد الوجهة وعدد المسافرين لحساب السعر تلقائياً)";
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }

    /* -------- 5) نموذج اتصل بنا — رسالة نجاح بسيطة -------- */
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const msg = document.getElementById("contact-success");
            if (msg) { msg.style.display = "block"; }
            contactForm.reset();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});

/* -------- 5) صفحة التفاصيل الديناميكية حسب ?id= -------- */
(function () {
    const titleEl = document.getElementById("detail-package-name");
    if (!titleEl) return;

    const packages = {
        bahah: {
            name: "🌿 باقة: غابات الباحة الخضراء",
            subtitle: "استكشف جمال الطبيعة المستدامة في غابات الباحة الخضراء",
            image: "images/dest-1.jpg",
            badge: "الأكثر برودة ❄️",
            description: "استمتع بتجربة فريدة وصديقة للبيئة في قلب غابات الباحة، حيث تلتقي الطبيعة البكر بالاستدامة الحقيقية. تم تصميم هذه الباقة لتقليل الانبعاثات الكربونية ودعم المجتمع المحلي.",
            destination: "غابات الباحة، المملكة العربية السعودية",
            duration: "3 أيام / 2 ليالي",
            price: "1,500 ريال سعودي / للفرد",
            hotel: "نُزل بيئي مستدام (3 نجوم)",
            transport: "حافلة جماعية متطورة صديقة للبيئة",
            activities: "المشي في الغابات، مراقبة الطيور، التخييم البيئي",
            itinerary: [
                "<strong>اليوم الأول:</strong> الوصول والاستقبال، جولة تعريفية بالنُزل البيئي، عشاء ترحيبي.",
                "<strong>اليوم الثاني:</strong> رحلة مشي مرشدة بين أشجار العرعر، ورشة مراقبة الطيور، أمسية فلكية.",
                "<strong>اليوم الثالث:</strong> زيارة قرى تراثية محلية، ورشة طبخ تقليدي، تخييم بيئي مسائي."
            ]
        },
        jeddah: {
            name: "🌊 باقة: شواطئ جدة المستدامة",
            subtitle: "اكتشف الشعاب المرجانية البكر بطرق صديقة للبيئة",
            image: "images/dest-2.jpg",
            badge: "مغامرة بحرية 🐠",
            description: "اكتشف الشعاب المرجانية البكر عبر رحلات غوص صديقة للبيئة مخصصة لحماية الحياة البحرية، مع برامج توعوية للحفاظ على النظام البيئي البحري في البحر الأحمر.",
            destination: "ساحل جدة، البحر الأحمر، المملكة العربية السعودية",
            duration: "4 أيام / 3 ليالي",
            price: "2,200 ريال سعودي / للفرد",
            hotel: "منتجع شاطئي بيئي (4 نجوم)",
            transport: "نقل خاص + قوارب كهربائية صديقة للبيئة",
            activities: "الغوص المسؤول، السنوركلينج، تنظيف الشواطئ، التجديف",
            itinerary: [
                "<strong>اليوم الأول:</strong> الوصول، استرخاء على الشاطئ، عشاء بحري مستدام.",
                "<strong>اليوم الثاني:</strong> جلسة غوص مع مرشد بيئي، التعرف على الشعاب المرجانية.",
                "<strong>اليوم الثالث:</strong> ورشة حماية الحياة البحرية، رحلة سنوركلينج جماعية.",
                "<strong>اليوم الرابع:</strong> حملة تنظيف الشاطئ، توديع وانطلاق."
            ]
        },
        ahsa: {
            name: "🌴 باقة: واحة الأحساء الخضراء",
            subtitle: "تجول بين ملايين أشجار النخيل في أكبر واحات العالم",
            image: "images/dest-3.jpg",
            badge: "إرث ثقافي 🏛️",
            description: "تجول بين ملايين أشجار النخيل وتعرف على أنظمة الري التقليدية العريقة في أكبر واحات العالم المسجلة في قائمة اليونسكو للتراث العالمي.",
            destination: "واحة الأحساء، المنطقة الشرقية، المملكة العربية السعودية",
            duration: "3 أيام / 2 ليالي",
            price: "1,800 ريال سعودي / للفرد",
            hotel: "نزل تراثي مرمم بمعايير بيئية (3 نجوم)",
            transport: "حافلة هجينة منخفضة الانبعاثات",
            activities: "جولة الواحة، زيارة العيون، ورشة تمور، التراث المحلي",
            itinerary: [
                "<strong>اليوم الأول:</strong> الوصول، جولة افتتاحية في الواحة، عشاء تقليدي.",
                "<strong>اليوم الثاني:</strong> زيارة العيون والآبار، ورشة عن أنظمة الري التقليدية.",
                "<strong>اليوم الثالث:</strong> سوق القيصرية، ورشة صناعة التمور، توديع."
            ]
        },
        abha: {
            name: "⛰️ باقة: جبال أبها الشاهقة",
            subtitle: "تخييم بيئي فاخر فوق أعلى القمم الجبلية بالمملكة",
            image: "images/dest-4.jpg",
            badge: "قمم جبلية 🏔️",
            description: "تخييم بيئي فاخر فوق أعلى القمم الجبلية بالمملكة مع رصد النجوم والتعرف على الفلك المحلي والاستمتاع بالضباب وأجواء الجنوب الفريدة.",
            destination: "أبها، منطقة عسير، المملكة العربية السعودية",
            duration: "5 أيام / 4 ليالي",
            price: "3,000 ريال سعودي / للفرد",
            hotel: "مخيمات بيئية فاخرة (Glamping) + نزل جبلي",
            transport: "رحلات داخلية + سيارات دفع رباعي كهربائية",
            activities: "التخييم، رصد النجوم، التلفريك، الهايكنغ، زيارة القرى",
            itinerary: [
                "<strong>اليوم الأول:</strong> الوصول لأبها، استكشاف وسط المدينة.",
                "<strong>اليوم الثاني:</strong> جبل السودة والتلفريك، عشاء بإطلالة جبلية.",
                "<strong>اليوم الثالث:</strong> رحلة هايكنغ مرشدة، ورشة رصد النجوم.",
                "<strong>اليوم الرابع:</strong> زيارة قرية رجال ألمع التراثية.",
                "<strong>اليوم الخامس:</strong> تخييم وداعي وانطلاق."
            ]
        },
        ula: {
            name: "🏜️ باقة: صحراء العلا العريقة",
            subtitle: "مسارات وتشكيلات صخرية ساحرة بزيارات للمواقع التاريخية",
            image: "images/dest-5.jpg",
            badge: "تاريخ طبيعي 🗿",
            description: "مسارات وتشكيلات صخرية ساحرة مدمجة بزيارات للمواقع التاريخية بوعي واستدامة بيئية كاملة، بما فيها مدائن صالح المسجلة في اليونسكو.",
            destination: "العلا، منطقة المدينة المنورة، المملكة العربية السعودية",
            duration: "4 أيام / 3 ليالي",
            price: "2,800 ريال سعودي / للفرد",
            hotel: "منتجع صحراوي بيئي مستدام (4 نجوم)",
            transport: "نقل خاص بسيارات هجينة",
            activities: "زيارة مدائن صالح، جبل الفيل، الحرة البركانية، ورش ثقافية",
            itinerary: [
                "<strong>اليوم الأول:</strong> الوصول، استرخاء بالمنتجع، عشاء صحراوي.",
                "<strong>اليوم الثاني:</strong> جولة في مدائن صالح (الحِجْر) مع مرشد متخصص.",
                "<strong>اليوم الثالث:</strong> جبل الفيل والحرة البركانية، أمسية رصد نجوم.",
                "<strong>اليوم الرابع:</strong> سوق العلا التراثي، توديع."
            ]
        }
    };

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "bahah";
    const p = packages[id] || packages.bahah;

    document.title = p.name.replace(/[^\u0600-\u06FFa-zA-Z0-9 :]/g, "") + " - وكالة المسار الأخضر";
    titleEl.innerText = p.name;
    document.getElementById("detail-main-title").innerText = "تفاصيل: " + p.name.replace(/^[^\s]+\s*/, "");
    document.getElementById("detail-subtitle").innerText = p.subtitle;
    const heroImg = document.getElementById("detail-hero-image");
    heroImg.src = p.image; heroImg.alt = p.name;
    document.getElementById("detail-badge").innerText = p.badge;
    document.getElementById("detail-description").innerText = p.description;
    document.getElementById("spec-destination").innerText = p.destination;
    document.getElementById("spec-duration").innerText = p.duration;
    document.getElementById("spec-price").innerText = p.price;
    document.getElementById("spec-hotel").innerText = p.hotel;
    document.getElementById("spec-transport").innerText = p.transport;
    document.getElementById("spec-activities").innerText = p.activities;
    const list = document.getElementById("detail-itinerary-list");
    if (list) {
        list.innerHTML = "";
        p.itinerary.forEach(line => {
            const li = document.createElement("li");
            li.innerHTML = line;
            list.appendChild(li);
        });
    }
    const bookBtn = document.getElementById("detail-book-btn");
    if (bookBtn) bookBtn.href = "booking.html?package=" + id;
})();
