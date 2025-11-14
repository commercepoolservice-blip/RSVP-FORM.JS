/* rsvp-form.js
   External script for Convery Lake George RSVP (works with FormSubmit).
   Host this file on a public CDN (jsDelivr via GitHub is recommended).
*/

(function () {
  // Wait until DOM is loaded
  function ready(fn) {
    if (document.readyState !== 'loading') return fn();
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // Elements (selectors must match the HTML snippet)
    const attendingEl = document.getElementById('attending');
    const funrunEl = document.getElementById('funrun');
    const cornholeEl = document.getElementById('cornhole');
    const notAttendingEl = document.getElementById('notAttending');
    const partySection = document.getElementById('partySection');
    const runSection = document.getElementById('runSection');
    const cornholeSection = document.getElementById('cornholeSection');
    const guestCountEl = document.getElementById('guestCount');
    const runnerCountEl = document.getElementById('runnerCount');
    const guestList = document.getElementById('guestList');
    const runnerList = document.getElementById('runnerList');
    const form = document.getElementById('rsvpForm');
    const nextField = document.getElementById('_next');
    const thankYou = document.getElementById('thankYou');

    if (!form) return; // safety

    // Build next URL for FormSubmit redirect back to page
    try {
      nextField.value = window.location.href.split('#')[0].split('?')[0] + '?thanks=1';
    } catch (e) { /* ignore */ }

    // Toggle sections
    function toggleSections() {
      partySection.classList.toggle('hidden', !attendingEl.checked);
      runSection.classList.toggle('hidden', !funrunEl.checked);
      cornholeSection.classList.toggle('hidden', !cornholeEl.checked);

      if (notAttendingEl.checked) {
        attendingEl.checked = funrunEl.checked = cornholeEl.checked = false;
        partySection.classList.add('hidden');
        runSection.classList.add('hidden');
        cornholeSection.classList.add('hidden');
      }

      if (!partySection.classList.contains('hidden') && guestList.children.length === 0) generateGuests();
      if (!runSection.classList.contains('hidden') && runnerList.children.length === 0) generateRunners();
    }

    // Generate guest rows (names + T-shirt size)
    function generateGuests() {
      let cnt = parseInt(guestCountEl.value, 10) || 1;
      if (cnt < 1) cnt = 1;
      guestList.innerHTML = '';
      for (let i = 1; i <= cnt; i++) {
        const block = document.createElement('div');
        block.className = 'row';
        block.style.marginBottom = '8px';
        block.innerHTML = `
          <div class="row" style="width:100%; gap:10px;">
            <div class="col">
              <label style="font-weight:600; font-size:13px;">Guest ${i} Name</label>
              <input type="text" name="Guest ${i} Name" required>
            </div>
            <div style="width:160px;">
              <label style="font-weight:600; font-size:13px;">T-shirt Size</label>
              <select name="Guest ${i} T-Shirt Size" required>
                <option value="">Size</option><option>Small</option><option>Medium</option><option>Large</option><option>XL</option><option>XXL</option>
              </select>
            </div>
          </div>`;
        guestList.appendChild(block);
      }
    }

    // Generate runner rows (name + age + gender)
    function generateRunners() {
      let cnt = parseInt(runnerCountEl.value, 10) || 1;
      if (cnt < 1) cnt = 1;
      runnerList.innerHTML = '';
      for (let i = 1; i <= cnt; i++) {
        const block = document.createElement('div');
        block.className = 'row';
        block.style.marginBottom = '8px';
        block.innerHTML = `
          <div class="row" style="width:100%; gap:10px;">
            <div class="col">
              <label style="font-weight:600; font-size:13px;">Runner ${i} Name</label>
              <input type="text" name="Runner ${i} Name" required>
            </div>
            <div style="width:90px;">
              <label style="font-weight:600; font-size:13px;">Age</label>
              <input type="number" name="Runner ${i} Age" min="1" required>
            </div>
            <div style="width:140px;">
              <label style="font-weight:600; font-size:13px;">Gender</label>
              <select name="Runner ${i} Gender" required>
                <option value="">Select</option><option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
              </select>
            </div>
          </div>`;
        runnerList.appendChild(block);
      }
    }

    // Event bindings
    attendingEl.addEventListener('change', toggleSections);
    funrunEl.addEventListener('change', toggleSections);
    cornholeEl.addEventListener('change', toggleSections);
    notAttendingEl.addEventListener('change', toggleSections);
    guestCountEl.addEventListener('change', generateGuests);
    runnerCountEl.addEventListener('change', generateRunners);

    // When user returns via ?thanks=1 show thank-you
    (function checkThanks() {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('thanks') === '1') {
          form.classList.add('hidden');
          thankYou.classList.remove('hidden');
          if (history.replaceState) history.replaceState(null, '', window.location.pathname);
        }
      } catch (e) {}
    })();

    // If someone toggles the attending checkbox to true, generate rows immediately
    attendingEl.addEventListener('change', function () { if (attendingEl.checked && guestList.children.length === 0) generateGuests(); });
    funrunEl.addEventListener('change', function () { if (funrunEl.checked && runnerList.children.length === 0) generateRunners(); });
  });
})();
