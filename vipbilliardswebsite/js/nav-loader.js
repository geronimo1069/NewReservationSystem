/**
 * VIP Billiards — Shared Navigation Loader
 * 
 * How to use on any page:
 *   1. Add  <div id="nav-placeholder"></div>  at the top of <body>
 *   2. Add  <script src="/js/nav-loader.js"></script>  before </body>
 *   3. Set  <body data-page="YOUR-PAGE-NAME">  so the right link gets highlighted
 *
 * Page name values:
 *   home | leagues | group-rates | guide | about | contact | slate
 */

(function () {
    const placeholder = document.getElementById('nav-placeholder');
    if (!placeholder) return;

    // Resolve path to nav.html relative to the site root.
    let path = window.location.pathname;
    
    // LOCAL FIX: If running in a subfolder locally, ignore the subfolder for depth calculation
    const localSubfolder = '/vipbilliardswebsite/';
    if (path.startsWith(localSubfolder)) {
        path = path.substring(localSubfolder.length - 1); // Treat /vipbilliardswebsite/ as root
    }

    const depth   = (path.match(/\//g) || []).length - 1;
    const prefix  = depth > 0 ? '../'.repeat(depth) : '';
    const navPath = prefix + 'nav.html';

    fetch(navPath)
        .then(r => {
            if (!r.ok) throw new Error('Nav fetch failed: ' + r.status);
            return r.text();
        })
        .then(html => {
            placeholder.innerHTML = html;
            initNav();
        })
        .catch(err => console.error('[nav-loader]', err));

    function initNav() {
        // ── Active link highlighting ──────────────────────────────────────
        const currentPage = document.body.dataset.page || '';
        const currentPath = window.location.pathname;

        document.querySelectorAll('#mainNav [data-page]').forEach(link => {
            const linkPage = link.dataset.page;
            // Match by data-page attribute OR by current URL path containing the page name
            if (
                linkPage === currentPage ||
                (linkPage !== 'home' && currentPath.includes(linkPage))
            ) {
                link.classList.add('active');
            }
            // Special case: home — only active when actually on index
            if (linkPage === 'home' && (currentPath === '/' || currentPath.endsWith('index.html'))) {
                link.classList.add('active');
            }
        });

        // ── Scroll: add .scrolled class to nav ───────────────────────────
        const nav = document.getElementById('mainNav');
        if (nav) {
            window.addEventListener('scroll', () => {
                nav.classList.toggle('scrolled', window.scrollY > 50);
            }, { passive: true });
        }

        // ── Mobile hamburger toggle ───────────────────────────────────────
        const mobileBtn = document.querySelector('.mobile-menu-toggle');
        const navMenu   = document.querySelector('.nav-menu');

        if (mobileBtn && navMenu) {
            mobileBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileBtn.classList.toggle('open');
            });
        }

        // ── Mobile mega menus: tap to expand ─────────────────────────────
        document.querySelectorAll('.dropdown.mega .dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', e => {
                if (!window.matchMedia('(max-width: 768px)').matches) return;
                e.preventDefault();
                const parent = toggle.closest('.dropdown.mega');
                document.querySelectorAll('.dropdown.mega').forEach(d => {
                    if (d !== parent) d.classList.remove('open');
                });
                parent.classList.toggle('open');
            });
        });

        // Close mega menus when an inner link is tapped (mobile)
        document.querySelectorAll('.mega-menu a').forEach(link => {
            link.addEventListener('click', () => {
                document.querySelectorAll('.dropdown.mega').forEach(d => d.classList.remove('open'));
                navMenu?.classList.remove('active');
                mobileBtn?.classList.remove('open');
            });
        });
    }
})();