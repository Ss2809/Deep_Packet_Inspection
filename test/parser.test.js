import test from 'node:test';
import assert from 'node:assert/strict';
import { DNSExtractor, HTTPHostExtractor } from '../src/services/extractors.js';
import { RuleManager } from '../src/services/ruleManager.js';

test('HTTP host extractor parses Host header and strips port', () => {
  const host = HTTPHostExtractor.extract(Buffer.from('GET / HTTP/1.1\r\nHost: example.com:80\r\n\r\n'));
  assert.equal(host, 'example.com');
});

test('DNS extractor parses a query name', () => {
  const payload = Buffer.from([0x12,0x34,0x01,0x00,0x00,0x01,0,0,0,0,0,0,7,101,120,97,109,112,108,101,3,99,111,109,0,0,1,0,1]);
  assert.equal(DNSExtractor.extractQuery(payload), 'example.com');
});

test('rule manager supports wildcard domains and ports', () => {
  const rules = new RuleManager();
  rules.blockDomain('*.example.com');
  rules.blockPort(443);
  assert.equal(rules.isDomainBlocked('api.example.com'), true);
  assert.equal(rules.isDomainBlocked('example.net'), false);
  assert.equal(rules.shouldBlock({ srcIp: 0, dstPort: 443, app: 'HTTPS', domain: '' }).type, 'PORT');
});
