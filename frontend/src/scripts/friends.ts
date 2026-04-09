// friends.ts

interface Friend {
  id: string;
  name: string;
  elo: number;
  avatar: string;
  online: boolean;
  winStreak?: number;
  lastSeen?: string;
}

interface FriendRequest {
  id: string;
  name: string;
  elo: number;
  avatar: string;
}

const ICON_CHALLENGE = `<img src="/assets/swords.svg" class="btn-icon-img" alt="Retar" />`;
const ICON_CHAT      = `<img src="/assets/message.svg" class="btn-icon-img" alt="Chat" />`;
const ICON_CHECK     = `<img src="/assets/check.svg" class="btn-icon-img" alt="Aceptar" />`;
const ICON_X         = `<img src="/assets/x.svg" class="btn-icon-img" alt="Rechazar" />`;
const ICON_EYE = `<img src="/assets/eye.svg" class="btn-icon-img" alt="Espectear" />`;
const ICON_FIRE = `<img src="/assets/flame.svg" class="streak-icon" alt="Racha" />`;

const DUMMY_FRIENDS: Friend[] = [
  { id: "1", name: "Magnus_Fan", elo: 2850, avatar: "/avatars/w_king_avatar.png", online: true, winStreak: 7 },
  { id: "2", name: "GambitoDeDama", elo: 1920, avatar: "/avatars/w_queen_avatar.png", online: true, winStreak: 3 },
  { id: "3", name: "ChessMaster_99", elo: 2100, avatar: "/avatars/b_rook_avatar.png", online: true},
  { id: "4", name: "PeonAvanzado", elo: 1450, avatar: "/avatars/b_pawn_avatar.png", online: false },
  { id: "5", name: "ReyVulnerable", elo: 1200, avatar: "/avatars/b_king_avatar.png", online: false },
  { id: "6", name: "EnroqueLargo", elo: 1780, avatar: "/avatars/w_rook_avatar.png", online: false, winStreak: 4 },
  { id: "7", name: "BobbyF", elo: 2450, avatar: "/avatars/w_horse_avatar.png", online: false },
  { id: "8", name: "LaDama", elo: 2310, avatar: "/avatars/b_queen_avatar.png", online: false },
];

const DUMMY_REQUESTS: FriendRequest[] = [
  { id: "req1", name: "Kasparov_Jr", elo: 1600, avatar: "/avatars/b_bishop_avatar.png" },
  { id: "req2", name: "BobbyF", elo: 2450, avatar: "/avatars/w_horse_avatar.png" },
];

const createFriendCard = (friend: Friend): string => `
  <div class="friend-card" onclick="window.location.href='/profile'">
    <div class="friend-content">
      <div class="status-dot-container">
        <img class="avatar-img" src="${friend.avatar}" alt="${friend.name}">
        <span class="online-indicator" style="background: ${friend.online ? '#4ade80' : '#666'}; border: 3.5px solid #151515;"></span>
      </div>
      <div class="friend-text-info">
        <div class="name-row">
          <span class="friend-name">${friend.name}</span>
          ${friend.winStreak && friend.winStreak >= 3 ? `
            <div class="streak-badge" title="Racha de ${friend.winStreak} victorias">
              ${ICON_FIRE} <span>${friend.winStreak}</span>
            </div>
          ` : ''}
        </div>
        <div class="status-row">
          <span class="friend-elo">${friend.elo} ELO</span>
          ${!friend.online && friend.lastSeen ? `
            <span class="last-seen">• Desconectado hace ${friend.lastSeen}</span>
          ` : ''}
        </div>
      </div>
    </div>

    <div class="btn-group" onclick="event.stopPropagation()">
      ${friend.online ? `
        <button class="btn-action btn-primary-action">${ICON_EYE}</button>
        <button class="btn-action btn-primary-action">${ICON_CHALLENGE}</button>
      ` : ''}
      <button class="btn-action btn-primary-action">${ICON_CHAT}</button>
    </div>
  </div>
`;

const createRequestCard = (req: FriendRequest): string => `
  <div class="friend-card clickable-card request-card-border" onclick="window.location.href='/profile'">
    <div class="friend-content">
      <img class="avatar-img small-avatar" src="${req.avatar}" alt="${req.name}">
      <div class="friend-text-info">
        <span class="req-name">${req.name}</span>
        <span class="req-elo">${req.elo} ELO</span>
      </div>
    </div>
    <div class="btn-group" onclick="event.stopPropagation()">
      <button class="btn-action btn-aceptar">${ICON_CHECK}</button>
      <button class="btn-action btn-rechazar">${ICON_X}</button>
    </div>
  </div>
`;

const renderFriends = (filter: string = "") => {
  const container = document.getElementById("friendsAllList");
  if (!container) return;
  const filtered = DUMMY_FRIENDS.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()) || f.elo.toString().includes(filter));
  container.innerHTML = filtered.length > 0 ? filtered.map(f => createFriendCard(f)).join('') : '<p style="color: gray; text-align: center; margin-top: 2rem;">No se encontraron resultados</p>';
};

const init = () => {
  const searchInput = document.getElementById("friendSearch") as HTMLInputElement;
  const reqList = document.getElementById("friendsRequestsList");
  const reqCount = document.getElementById("reqCount");

  searchInput?.addEventListener('input', (e) => renderFriends((e.target as HTMLInputElement).value));
  renderFriends();
  if (reqList) {
    reqList.innerHTML = DUMMY_REQUESTS.map(r => createRequestCard(r)).join('');
    if (reqCount) reqCount.innerText = DUMMY_REQUESTS.length.toString();
  }
};

document.addEventListener('astro:page-load', init);
if (document.readyState !== 'loading') init();