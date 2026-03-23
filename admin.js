// admin.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { collection, onSnapshot, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

  const gate = document.getElementById('authGate');
  const dashboard = document.getElementById('dashboardContent');
  const btnLogout = document.getElementById('btnLogout');
  const statsWarning = document.getElementById('statsWarning');

  // Reveal script (from script.js logic)
  function runReveals() {
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => io.observe(el));
  }

  // Handle Logout
  btnLogout.addEventListener('click', () => {
    if(auth) {
      signOut(auth).then(() => {
        window.location.href = 'index.html';
      });
    } else {
      window.location.href = 'index.html';
    }
  });

  if (auth) {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'admin@aura.fr') {
        // Logged in as Admin!
        gate.style.display = 'none';
        dashboard.style.display = 'block';
        runReveals();
        loadFirestoreStats();
      } else {
        // Not admin or not logged in -> Redirect
        window.location.href = 'login.html';
      }
    });
  } else {
    // If Firebase is not configured, we show dummy data for the tutorial purpose
    gate.style.display = 'none';
    dashboard.style.display = 'block';
    statsWarning.style.display = 'flex';
    runReveals();
    renderDummyData();
  }

  function loadFirestoreStats() {
    if (!db) return;
    const cartsRef = collection(db, 'carts');
    
    // Listen to real-time updates
    onSnapshot(cartsRef, (snapshot) => {
      let abandoned = 0;
      let purchased = 0;
      let revenue = 0;
      let productCounts = {};

      snapshot.forEach(doc => {
        const data = doc.data();
        
        if (data.status === 'purchased') {
          purchased++;
          revenue += (data.totalPrice || 0);
        } else {
          abandoned++; // active or abandoned
        }

        if (data.items && Array.isArray(data.items)) {
          data.items.forEach(item => {
            if (!productCounts[item.name]) {
              productCounts[item.name] = 0;
            }
            productCounts[item.name] += item.qty;
          });
        }
      });

      // Update UI Counters
      document.getElementById('statAbandoned').innerText = abandoned;
      document.getElementById('statPurchased').innerText = purchased;
      document.getElementById('statRevenue').innerText = parseFloat(revenue).toFixed(2).replace('.', ',') + ' €';

      // Update Top Products
      renderProductTable(productCounts);
    }, (error) => {
      console.error("Error fetching carts:", error);
      statsWarning.style.display = 'flex';
      statsWarning.querySelector('span').innerText = "Erreur de lecture Firestore. Vérifiez les règles de sécurité.";
    });
  }

  function renderProductTable(productCounts) {
    // Sort descending by qty
    const sortedProducts = Object.keys(productCounts).sort((a,b) => productCounts[b] - productCounts[a]);
    const tbody = document.getElementById('productList');
    
    if (sortedProducts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;color:gray;font-size:0.9rem;padding:30px;">Aucune donnée panier enregistrée.</td></tr>';
      return;
    }

    let html = '';
    sortedProducts.forEach(productName => {
      html += `
        <tr>
          <td>${productName}</td>
          <td style="text-align:right;"><strong>${productCounts[productName]}</strong></td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  // Dummy data if Firebase isn't set up yet
  function renderDummyData() {
    document.getElementById('statAbandoned').innerText = "12";
    document.getElementById('statPurchased').innerText = "45";
    document.getElementById('statRevenue').innerText = "8 550,00 €";
    renderProductTable({
      "Aura Charnelle": 24,
      "Onyx": 18,
      "Rose Incarnée": 15,
      "Coffret Le Prélude": 9
    });
  }

});
