const products = [
  { id: 1, name: "Maggie", icon: "🍜", base: 30 },
  { id: 2, name: "Samosa", icon: "🥟", base: 15 },
  { id: 3, name: "Cold Drink", icon: "🥤", base: 25 },
  { id: 4, name: "Burger", icon: "🍔", base: 60 },
];

const viewerEl = document.getElementById("viewerCount");
const cardsEl = document.getElementById("cards");
const chartEl = document.getElementById("priceChart");
const ctx = chartEl.getContext("2d");

let priceHistory = [];

// Random viewer count
function updateViewerCount() {
  viewerEl.textContent = Math.floor(Math.random() * 900) + 100;
}

// Generate random price using demand factor
function generatePrice(base) {
  const demand = 0.8 + Math.random() * 1.6; // demand factor
  return +(base * demand).toFixed(2);
}

// Render product cards
function renderCards() {
  cardsEl.innerHTML = "";
  products.forEach(p => {
    const price = generatePrice(p.base);
    const change = ((price - p.base) / p.base) * 100;
    const changeColor = change >= 0 ? "var(--accent)" : "var(--red)";

    priceHistory.push(price);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header">
        <div class="left">
          <div class="icon">${p.icon}</div>
          <div>
            <div class="card-title">${p.name}</div>
            <div class="card-subtitle">Food Item</div>
          </div>
        </div>
        <div class="price" id="price-${p.id}">$${price}</div>
      </div>

      <div class="change" id="change-${p.id}" style="color:${changeColor}">
        ${change >= 0 ? "+" : ""}${change.toFixed(2)}%
      </div>

      <div class="buy-section">
        <input type="number" class="qty" id="qty-${p.id}" value="1" min="1">
        <button class="buy-btn" onclick="buy(${p.id})">Buy</button>
      </div>
      <div class="total" id="total-${p.id}">Total: $${price.toFixed(2)}</div>
    `;

    cardsEl.appendChild(card);

    // Quantity change listener
    document.getElementById(`qty-${p.id}`).addEventListener("input", () => {
      updateTotal(p.id);
    });
  });
}

// Update total price
function updateTotal(id) {
  const qty = document.getElementById(`qty-${id}`).value;
  const price = parseFloat(document.getElementById(`price-${id}`).textContent.replace("$", ""));
  document.getElementById(`total-${id}`).textContent = `Total: $${(price * qty).toFixed(2)}`;
}

// Buy function
function buy(id) {
  const qty = document.getElementById(`qty-${id}`).value;
  const price = document.getElementById(`price-${id}`).textContent;
  alert(`Bought ${qty} item(s) for ${price} each.`);
}

// Price update every 5 minutes
function updatePrices() {
  products.forEach(p => {
    const newPrice = generatePrice(p.base);
    const oldPrice = parseFloat(document.getElementById(`price-${p.id}`).textContent.replace("$", ""));
    const change = ((newPrice - oldPrice) / oldPrice) * 100;

    const priceEl = document.getElementById(`price-${p.id}`);
    const changeEl = document.getElementById(`change-${p.id}`);

    priceEl.textContent = `$${newPrice.toFixed(2)}`;
    changeEl.textContent = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
    changeEl.style.color = change >= 0 ? "var(--accent)" : "var(--red)";

    // Flash color effect
    priceEl.style.transition = "color 0.2s ease";
    priceEl.style.color = change >= 0 ? "var(--accent)" : "var(--red)";
    setTimeout(() => {
      priceEl.style.color = "var(--text)";
    }, 300);

    updateTotal(p.id);

    priceHistory.push(newPrice);
  });

  renderChart();
}

// Render line chart
function renderChart() {
  const w = chartEl.clientWidth;
  const h = chartEl.clientHeight;
  chartEl.width = w;
  chartEl.height = h;

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(96,165,250,0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();

  const max = Math.max(...priceHistory);
  const min = Math.min(...priceHistory);

  priceHistory.forEach((p, i) => {
    const x = (i / (priceHistory.length - 1)) * w;
    const y = h - ((p - min) / (max - min)) * h;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();
}

// Initial setup
updateViewerCount();
renderCards();
renderChart();

// Update viewer count every 5 seconds
setInterval(updateViewerCount, 5000);

// Update prices every 5 minutes
setInterval(updatePrices, 300000);
