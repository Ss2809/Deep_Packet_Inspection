import { EtherType, Protocol, ipIntToString } from '../utils/types.js';
export class PacketParser {
  static parse(raw) { let offset = 0; const data = raw.data; const parsed = { timestampSec: raw.header.tsSec, timestampUsec: raw.header.tsUsec, hasIp: false, hasTcp: false, hasUdp: false, payloadLength: 0, payloadOffset: 0 };
    if (data.length < 14) return null; parsed.destMac = this.macToString(data.subarray(0,6)); parsed.srcMac = this.macToString(data.subarray(6,12)); parsed.etherType = data.readUInt16BE(12); offset = 14;
    if (parsed.etherType !== EtherType.IPv4) return { ...parsed, payloadOffset: offset, payloadLength: Math.max(0, data.length - offset) };
    if (data.length < offset + 20) return null; const ihl = data[offset] & 0x0f; const ipHeaderLen = ihl * 4; if ((data[offset] >> 4) !== 4 || ipHeaderLen < 20 || data.length < offset + ipHeaderLen) return null; parsed.ipVersion = 4; parsed.ttl = data[offset+8]; parsed.protocol = data[offset+9]; parsed.srcIpInt = data.readUInt32LE(offset+12); parsed.dstIpInt = data.readUInt32LE(offset+16); parsed.srcIp = ipIntToString(parsed.srcIpInt); parsed.dstIp = ipIntToString(parsed.dstIpInt); parsed.hasIp = true; offset += ipHeaderLen;
    if (parsed.protocol === Protocol.TCP) { if (data.length < offset + 20) return null; parsed.srcPort = data.readUInt16BE(offset); parsed.dstPort = data.readUInt16BE(offset+2); parsed.seqNumber = data.readUInt32BE(offset+4); parsed.ackNumber = data.readUInt32BE(offset+8); const tcpLen = ((data[offset+12] >> 4) & 0x0f) * 4; parsed.tcpFlags = data[offset+13]; if (tcpLen < 20 || data.length < offset + tcpLen) return null; parsed.hasTcp = true; offset += tcpLen; }
    else if (parsed.protocol === Protocol.UDP) { if (data.length < offset + 8) return null; parsed.srcPort = data.readUInt16BE(offset); parsed.dstPort = data.readUInt16BE(offset+2); parsed.hasUdp = true; offset += 8; }
    parsed.payloadOffset = offset; parsed.payloadLength = Math.max(0, data.length - offset); parsed.payload = data.subarray(offset); return parsed; }
  static macToString(buf) { return [...buf].map((b) => b.toString(16).padStart(2,'0')).join(':'); }
}
