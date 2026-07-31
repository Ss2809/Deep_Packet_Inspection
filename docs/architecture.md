# Architecture

The production Node.js version keeps the same logical pipeline as the original C++ analyzer while exposing it through an Express API.

```text
PCAP upload / CLI input
        |
        v
PcapReader -> PacketParser -> DPIEngine hash dispatch -> FastPathProcessor
                                                        |
                                                        v
                                      ConnectionTracker + Extractors + RuleManager
                                                        |
                                                        v
                                      forwarded packets -> filtered PCAP
```

## Modules

- `src/services/pcapReader.js` reads and writes classic PCAP files.
- `src/services/packetParser.js` parses Ethernet, IPv4, TCP, and UDP headers.
- `src/services/extractors.js` extracts TLS SNI, HTTP host headers, and DNS query names.
- `src/services/ruleManager.js` stores blocking rules for IPs, apps, domains, and ports.
- `src/services/connectionTracker.js` tracks flow state, byte counters, app classification, and top domains.
- `src/services/fastPath.js` performs per-packet inspection and rule enforcement.
- `src/services/dpiEngine.js` orchestrates an analysis run and writes filtered output.
- `src/controllers`, `src/routes`, and `src/middleware` provide the Express application structure.

## Behavioral compatibility

The JavaScript modules preserve the original analyzer's key behavior: five-tuple connection identity, SNI and host extraction, DNS classification, known-application mapping, rule matching, connection state transitions, and filtered PCAP output.
