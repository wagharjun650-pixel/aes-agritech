// AES AGRITECH - सर्व पानांसाठी एकच स्क्रिप्ट

// ========== महत्त्वाचे ==========
// Google Apps Script "Web app" ची पूर्ण लिंक येथे टाका (https://script.google.com/macros/s/....../exec)
const FORM_URL = 'https://script.google.com/macros/s/AKfycbwlVoZUHqZZXEQlifawF5xGo-a67-DfIvNGBzc3Zlcd/exec';
// ================================

// कॉपीराइट वर्ष आपोआप
document.querySelectorAll('.js-year').forEach(el => { el.textContent = new Date().getFullYear(); });

// मोबाईल मेनू
(function () {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('navMenu');
    if (!btn || !menu) return;

    function setOpen(open) {
        menu.classList.toggle('show', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    }
    btn.addEventListener('click', () => setOpen(!menu.classList.contains('show')));
    document.addEventListener('click', e => {
        if (!e.target.closest('nav') && !e.target.closest('#mobileMenuBtn')) setOpen(false);
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
})();

// फॉर्म सबमिट (सभासद नोंदणी आणि संपर्क)
function handleForm(formId, formType) {
    const form = document.getElementById(formId);
    if (!form) return;
    const btn = form.querySelector('.submit-btn');
    const ok = form.querySelector('.form-success');
    const err = form.querySelector('.form-error');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        ok.style.display = 'none';
        err.style.display = 'none';

        const data = { formType: formType };
        new FormData(form).forEach((value, key) => {
            data[key] = (key in data) ? data[key] + ', ' + value : value;   // एकापेक्षा जास्त चेकबॉक्स
        });
        data.pageUrl = location.href;

        const label = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> पाठवत आहे...';

        try {
            const res = await fetch(FORM_URL, { method: 'POST', body: JSON.stringify(data) });
            const json = await res.json();
            if (json.result !== 'success') throw new Error(json.message || 'Server error');
            form.reset();
            ok.style.display = 'block';
            ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            console.error('Form error:', error);
            err.style.display = 'block';
            err.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } finally {
            btn.disabled = false;
            btn.innerHTML = label;
        }
    });
}
handleForm('memberRegistrationForm', 'registration');
handleForm('contactForm', 'contact');
handleForm('grainForm', 'grain');
handleForm('inputsForm', 'inputs');

// मुख्यपृष्ठावरील "धान्य विका / खरेदी करा" बटणावरून आल्यास योग्य पर्याय आपोआप निवडा (grain.html?type=sell किंवा buy)
(function () {
    const type = new URLSearchParams(location.search).get('type');
    if (!type) return;
    const value = type === 'buy' ? 'धान्य खरेदी' : 'धान्य विक्री';
    const radio = document.querySelector('input[name="intent"][value="' + value + '"]');
    if (radio) {
        radio.checked = true;
        const target = document.getElementById('enquiry');
        if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 400);
    }
})();
