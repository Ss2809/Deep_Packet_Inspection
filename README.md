# Deep Packet Inspection API (Node.js + Express)

This repository has been converted from the original C++ packet analyzer into a production-ready **Node.js 20+** application using **Express** and **ES modules**. It preserves the original PCAP workflow:

1. Read a classic Ethernet PCAP file.
2. Parse Ethernet, IPv4, TCP, and UDP headers.
3. Build five-tuples for flow tracking and load distribution.
4. Inspect payloads for TLS SNI, HTTP `Host`, and DNS query names.
5. Classify common applications from domains/SNI.
6. Apply IP, application, domain, and destination-port blocking rules.
7. Write a filtered output PCAP containing only forwarded packets.
8. Return JSON reports with packet, rule, connection, and application statistics.

## Project layout

```text
src/
  app.js                         Express app factory
  server.js                      HTTP server entrypoint
  cli/analyze.js                 CLI PCAP analyzer
  controllers/                   HTTP request handlers
  routes/                        Express routers
  middleware/                    Error and 404 middleware
  services/                      Converted analyzer modules
  utils/types.js                 Protocol constants, tuple helpers, app mapping
```

## C++ to JavaScript conversion map

| Original C++ file | JavaScript module |
| --- | --- |
| `include/types.h`, `src/types.cpp` | `src/utils/types.js` |
| `include/pcap_reader.h`, `src/pcap_reader.cpp` | `src/services/pcapReader.js` |
| `include/packet_parser.h`, `src/packet_parser.cpp` | `src/services/packetParser.js` |
| `include/sni_extractor.h`, `src/sni_extractor.cpp` | `src/services/extractors.js` |
| `include/rule_manager.h`, `src/rule_manager.cpp` | `src/services/ruleManager.js` |
| `include/connection_tracker.h`, `src/connection_tracker.cpp` | `src/services/connectionTracker.js` |
| `include/fast_path.h`, `src/fast_path.cpp` | `src/services/fastPath.js` |
| `include/load_balancer.h`, `src/load_balancer.cpp` | `src/services/dpiEngine.js` hash-based FP selection |
| `include/dpi_engine.h`, `src/dpi_engine.cpp`, `src/dpi_mt.cpp`, `src/main*.cpp` | `src/services/dpiEngine.js`, `src/server.js`, `src/cli/analyze.js` |

## Install

```bash
npm install
```

## Run the API

```bash
npm start
```

The service listens on `http://localhost:3000` by default. Override with `PORT=8080 npm start`.

## REST API

### Health

```bash
curl http://localhost:3000/api/health
```

### Analyze a PCAP

```bash
curl -F "pcap=@test_dpi.pcap" http://localhost:3000/api/analyze
```

The response includes per-packet actions, aggregate statistics, a classification report, and a download path for the filtered PCAP.

### Manage blocking rules

```bash
# Block a domain pattern
curl -X POST http://localhost:3000/api/rules \
  -H 'Content-Type: application/json' \
  -d '{"type":"domain","value":"*.youtube.com"}'

# Block an app classification
curl -X POST http://localhost:3000/api/rules \
  -H 'Content-Type: application/json' \
  -d '{"type":"app","value":"YouTube"}'

# Block a destination port
curl -X POST http://localhost:3000/api/rules \
  -H 'Content-Type: application/json' \
  -d '{"type":"port","value":443}'

# List rules
curl http://localhost:3000/api/rules

# Remove a rule
curl -X DELETE http://localhost:3000/api/rules \
  -H 'Content-Type: application/json' \
  -d '{"type":"port","value":443}'
```

## CLI usage

```bash
npm run cli -- test_dpi.pcap output.pcap
```

## Production notes

- The application avoids native dependencies and uses Buffers for binary parsing.
- Upload size defaults to 250 MB in `src/routes/analyzerRoutes.js`.
- Security middleware includes Helmet and CORS.
- `DPIEngine` keeps per-run analysis state isolated while sharing rule state for API requests.
- The filtered PCAP writer emits classic little-endian PCAP output with Ethernet link type.

## Tests and validation

```bash
npm test
npm run lint
```
