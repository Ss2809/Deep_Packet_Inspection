export const Protocol = Object.freeze({ ICMP: 1, TCP: 6, UDP: 17 });
export const EtherType = Object.freeze({ IPv4: 0x0800, IPv6: 0x86dd, ARP: 0x0806 });
export const TCPFlags = Object.freeze({ FIN: 0x01, SYN: 0x02, RST: 0x04, PSH: 0x08, ACK: 0x10, URG: 0x20 });
export const ConnectionState = Object.freeze({ NEW: 'NEW', ESTABLISHED: 'ESTABLISHED', CLASSIFIED: 'CLASSIFIED', BLOCKED: 'BLOCKED', CLOSED: 'CLOSED' });
export const PacketAction = Object.freeze({ FORWARD: 'FORWARD', DROP: 'DROP', INSPECT: 'INSPECT', LOG_ONLY: 'LOG_ONLY' });
export const AppType = Object.freeze({ UNKNOWN:'Unknown', HTTP:'HTTP', HTTPS:'HTTPS', DNS:'DNS', TLS:'TLS', QUIC:'QUIC', GOOGLE:'Google', FACEBOOK:'Facebook', YOUTUBE:'YouTube', TWITTER:'Twitter/X', INSTAGRAM:'Instagram', NETFLIX:'Netflix', AMAZON:'Amazon', MICROSOFT:'Microsoft', APPLE:'Apple', WHATSAPP:'WhatsApp', TELEGRAM:'Telegram', TIKTOK:'TikTok', SPOTIFY:'Spotify', ZOOM:'Zoom', DISCORD:'Discord', GITHUB:'GitHub', CLOUDFLARE:'Cloudflare' });
const APP_PATTERNS = [
  [AppType.YOUTUBE, ['youtube','ytimg','youtu.be','yt3.ggpht']],
  [AppType.GOOGLE, ['google','gstatic','googleapis','ggpht','gvt1']],
  [AppType.FACEBOOK, ['facebook','fbcdn','fb.com','fbsbx','meta.com']],
  [AppType.INSTAGRAM, ['instagram','cdninstagram']],
  [AppType.WHATSAPP, ['whatsapp','wa.me']],
  [AppType.TWITTER, ['twitter','twimg','x.com','t.co']],
  [AppType.NETFLIX, ['netflix','nflxvideo','nflximg']],
  [AppType.AMAZON, ['amazon','amazonaws','cloudfront','aws']],
  [AppType.MICROSOFT, ['microsoft','msn.com','office','azure','live.com','outlook','bing']],
  [AppType.APPLE, ['apple','icloud','mzstatic','itunes']],
  [AppType.TELEGRAM, ['telegram','t.me']],
  [AppType.TIKTOK, ['tiktok','tiktokcdn','musical.ly','bytedance']],
  [AppType.SPOTIFY, ['spotify','scdn.co']],
  [AppType.ZOOM, ['zoom']],
  [AppType.DISCORD, ['discord','discordapp']],
  [AppType.GITHUB, ['github','githubusercontent']],
  [AppType.CLOUDFLARE, ['cloudflare','cf-']]
];
export function ipIntToString(ip) { return [ip & 255, (ip >>> 8) & 255, (ip >>> 16) & 255, (ip >>> 24) & 255].join('.'); }
export function ipStringToInt(ip) { return ip.split('.').reduce((acc, part, i) => acc | ((Number(part) & 255) << (i * 8)), 0) >>> 0; }
export function tupleKey(tuple) { return `${tuple.srcIp}:${tuple.srcPort}->${tuple.dstIp}:${tuple.dstPort}/${tuple.protocol}`; }
export function reverseTuple(tuple) { return { srcIp: tuple.dstIp, dstIp: tuple.srcIp, srcPort: tuple.dstPort, dstPort: tuple.srcPort, protocol: tuple.protocol }; }
export function hashTuple(tuple) { let h = 0; for (const n of [tuple.srcIp, tuple.dstIp, tuple.srcPort, tuple.dstPort, tuple.protocol]) h = (h ^ (n + 0x9e3779b9 + ((h << 6) >>> 0) + (h >>> 2))) >>> 0; return h; }
export function sniToAppType(sni = '') { const lower = sni.toLowerCase(); if (!lower) return AppType.UNKNOWN; for (const [app, patterns] of APP_PATTERNS) if (patterns.some((p) => lower.includes(p))) return app; return AppType.HTTPS; }
export function protocolToString(protocol) { return protocol === Protocol.TCP ? 'TCP' : protocol === Protocol.UDP ? 'UDP' : protocol === Protocol.ICMP ? 'ICMP' : `Unknown(${protocol})`; }
export function tcpFlagsToString(flags = 0) { const names = Object.entries(TCPFlags).filter(([, bit]) => flags & bit).map(([name]) => name); return names.length ? names.join(' ') : 'none'; }
