import type { Chapter, Flashcard, Part } from '../types'

export const interviewPart: Part = {
  id: 'p14',
  title: 'Interview Prep',
  description: '25 interview-ready computer networking questions with clear explanations, troubleshooting, and security focus.'
}

export const interviewChapter: Chapter = {
  id: 'c39',
  partId: 'p14',
  order: 1,
  title: 'Computer Networks Interview Questions',
  description: 'Core interview questions covering OSI/TCP-IP, switching/routing, IP, DNS, HTTP/TLS, troubleshooting, and DDoS defense.'
}

const c = (f: Flashcard): Flashcard => f

export const interviewFlashcards: Flashcard[] = [
  c({ id:'iq1', chapterId:'c39', partId:'p14', type:'deep', difficulty:'intermediate', tags:['interview','osi','layers'],
    front:{ title:'OSI Responsibilities', question:'Explain the responsibilities of all seven layers of the OSI model.', category:'Interview' },
    back:{ explanation:'OSI (7â†’1): Application provides network services to apps; Presentation handles data representation/translation/compression/encryption; Session manages dialogs; Transport provides end-to-end process communication (segmentation, ports, and reliability/flow control when supported); Network provides logical addressing and routing; Data Link provides node-to-node delivery on a local link (framing, link addressing, error detection); Physical transmits bits as signals over media. Data is encapsulated down the sender stack and decapsulated up the receiver stack.',
      internals:'PDUs commonly described as data/segment/packet/frame/bits (model-dependent). Devices map roughly: L2 switches, L3 routers.',
      why:'Separates concerns for design, interoperability, and troubleshooting; real stacks may not implement layers as separate components but the model is useful conceptually.',
      security:'Attacks/controls map by layer (e.g., ARP/MAC issues at L2, IP spoofing/routing at L3, SYN floods at L4, web/app attacks at L7).', related:['TCP/IP Model','Encapsulation'] } }),

  c({ id:'iq2', chapterId:'c39', partId:'p14', type:'compare', difficulty:'intermediate', tags:['interview','osi','tcpip'],
    front:{ title:'OSI vs TCP/IP', question:'Compare the OSI model with the TCP/IP model.', category:'Interview' },
    back:{ explanation:'OSI is a 7-layer conceptual reference model (Physical, Data Link, Network, Transport, Session, Presentation, Application). TCP/IP models the Internet protocol suite, commonly 4 layers (Link/Network Access, Internet, Transport, Application) or 5 in some presentations. TCP/IP merges OSI Session/Presentation/Application into Application and often merges Data Link/Physical into Link; Transport and Network/Internet map closely.',
      internals:'TCP/IP aligns with deployed protocols (IP, TCP/UDP, HTTP, DNS). OSI is not tied to one suite.',
      why:'Use TCP/IP to describe real protocol behavior and OSI terminology to isolate responsibilities during troubleshooting.', related:['OSI Model','Internet Protocol Suite'] } }),

  c({ id:'iq3', chapterId:'c39', partId:'p14', type:'how', difficulty:'intermediate', tags:['interview','encapsulation'],
    front:{ title:'Encapsulation vs De-encapsulation', question:'Explain encapsulation and de-encapsulation in computer networks.', category:'Interview' },
    back:{ explanation:'Encapsulation adds protocol control information as data moves down the sender stack: each layer treats upper-layer data as payload and adds headers (and sometimes trailers). De-encapsulation is the reverse at the receiver: each layer processes/removes its control info and passes the payload upward.',
      internals:'Example: HTTP message â†’ TCP segment (ports/seq) â†’ IP packet (src/dst IP) â†’ Ethernet frame (MACs + FCS) â†’ signals. Receiver processes frame, then packet, then segment, delivering app data to the correct process.',
      why:'Enables layered independence and correct addressing/multiplexing/integrity checks at each scope.', related:['PDUs','TCP/IP'] } }),

  c({ id:'iq4', chapterId:'c39', partId:'p14', type:'compare', difficulty:'beginner', tags:['interview','hub','switch','router'],
    front:{ title:'Hub vs Switch vs Router', question:'Differentiate between a hub, switch and router based on how they forward data.', category:'Interview' },
    back:{ explanation:'Hub (L1) repeats incoming signals to all other ports with no address lookup. Switch (L2) forwards Ethernet frames using destination MAC and a MAC table (VLAN-scoped): known unicast to one port, unknown unicast/broadcast flooded within VLAN. Router (L3) forwards IP packets between networks using destination IP and routing table to select next hop/outgoing interface.',
      internals:'Hubs extend one collision domain; switches separate collision domains per port and create VLAN broadcast domains; routers separate broadcast domains.',
      security:'Hubs expose traffic broadly; switches can be attacked (e.g. MAC flooding/ARP issues); routers enforce inter-network boundaries.', related:['MAC Table','Routing Table','VLAN'] } }),

  c({ id:'iq5', chapterId:'c39', partId:'p14', type:'concept', difficulty:'intermediate', tags:['interview','mac','ip','arp'],
    front:{ title:'Why MAC and IP Both?', question:'Why does a device need both a MAC address and an IP address for communication?', category:'Interview' },
    back:{ explanation:'IP is a logical (network-layer) address used for routing across networks to the intended destination. MAC is a link-layer address used to deliver frames on the current local link (Ethernet/Wiâ€‘Fi). For local destinations the frame targets the hostâ€™s MAC; for remote destinations the frame targets the next-hop routerâ€™s MAC while the IP destination remains end-to-end. Routers decapsulate and re-encapsulate with new local MACs at each hop.',
      internals:'Hosts resolve next-hop link-layer addresses via ARP (IPv4) or Neighbor Discovery/ICMPv6 (IPv6). NAT can modify IPs, but MACs still change per link.',
      why:'IP answers â€œwhere ultimatelyâ€; MAC answers â€œwhich local interface nextâ€.', related:['ARP','Default Gateway','Routing'] } }),

  c({ id:'iq6', chapterId:'c39', partId:'p14', type:'how', difficulty:'intermediate', tags:['interview','switch','mac-learning'],
    front:{ title:'Switch MAC Learning & Forwarding', question:'How does a switch learn and use MAC addresses to forward frames?', category:'Interview' },
    back:{ explanation:'A switch learns by recording source MAC, ingress port, and VLAN in its MAC (CAM/forwarding) table. For forwarding it looks up the destination MAC: known unicast â†’ send only to mapped port; unknown unicast â†’ flood within VLAN (except ingress); broadcast â†’ flood within VLAN; if destination maps to ingress port â†’ filter. Entries age out to adapt to moves.',
      internals:'Learning/forwarding is VLAN-specific; table updates when a MAC appears on a new port.',
      security:'Table overflow/flooding attacks and spoofing are mitigated with port security, monitoring, etc.', related:['VLAN','CAM Table','Flooding'] } }),

  c({ id:'iq7', chapterId:'c39', partId:'p14', type:'how', difficulty:'intermediate', tags:['interview','arp','ipv4'],
    front:{ title:'ARP Resolution', question:'How does ARP resolve an IP address into a MAC address?', category:'Interview' },
    back:{ explanation:'On IPv4 local links, a host checks its ARP cache for the next-hop IP. If missing, it broadcasts an ARP Request asking â€œwho has this IP?â€ The owner replies (usually unicast) with its MAC; the sender caches the mapping and sends the Ethernet frame to that MAC. For off-link destinations the host ARPs for the default gatewayâ€™s IP, not the remote host. ARP is local-broadcast-domain scoped; IPv6 uses Neighbor Discovery instead.',
      internals:'Cache entries expire; gratuitous ARP can update mappings.',
      security:'ARP spoofing/poisoning can enable MITM; mitigations include DAI, DHCP snooping, segmentation.', related:['Neighbor Discovery','Default Gateway'] } }),

  c({ id:'iq8', chapterId:'c39', partId:'p14', type:'concept', difficulty:'beginner', tags:['interview','availability','spof'],
    front:{ title:'Single Point of Failure (SPOF)', question:'What is a Single Point of Failure (SPOF) in a network?', category:'Interview' },
    back:{ explanation:'A SPOF is any component, link, service, or dependency whose failure makes a required function unavailable because no redundancy or alternate path can take over. Examples: single edge router/firewall, core switch, sole WAN uplink, single DNS server, or shared power dependency. Reduce SPOFs with redundant devices/paths/services and independent dependencies, and validate failover through testing and health checks.',
      why:'Availability and resilience depend on removing unprotected critical dependencies.',
      realWorld:'Two devices on the same power source can still leave a SPOF.', related:['High Availability','Redundancy','Failover'] } }),

  c({ id:'iq9', chapterId:'c39', partId:'p14', type:'compare', difficulty:'intermediate', tags:['interview','ipv4','ipv6'],
    front:{ title:'IPv4 vs IPv6', question:'Compare IPv4 and IPv6.', category:'Interview' },
    back:{ explanation:'IPv4 uses 32-bit addresses (dotted decimal) with ~4.3B space; IPv6 uses 128-bit (hex) with vastly larger space. IPv6 has a fixed 40-byte base header with extension headers (IPv4 header variable 20â€“60B), replaces ARP with ICMPv6 Neighbor Discovery, has no broadcast (uses multicast/anycast), and routers do not fragment transit packets (PMTUD/source fragmentation). IPv4/IPv6 are separate protocols (often dual-stack); NAT is common in IPv4 for conservation but not required for IPv6 addressing.',
      internals:'IPv6 supports SLAAC and DHCPv6; configuration and security filtering must be handled for both stacks.',
      security:'Dual-stack can increase exposure if one stack is overlooked.', related:['NDP','SLAAC','Fragmentation'] } }),

  c({ id:'iq10', chapterId:'c39', partId:'p14', type:'how', difficulty:'intermediate', tags:['interview','nat','pat'],
    front:{ title:'NAT/PAT Sharing a Public IP', question:'How does NAT allow multiple private devices to access the Internet through one public IP address?', category:'Interview' },
    back:{ explanation:'Commonly via PAT/NAPT (NAT overload): for outbound flows the gateway rewrites the private source IP/port to its public IP and a unique translated port, storing a mapping in a translation table. Replies to that public IP/port are matched, rewritten back to the original private IP/port, and forwarded internally. This distinguishes many simultaneous flows through one public IPv4 address.',
      internals:'Checksums are updated as needed; mappings time out based on state/protocol.',
      security:'NAT conserves addresses and hides internal numbering but is not a substitute for firewall policy.', related:['Static/Dynamic NAT','Stateful Firewall'] } }),

  c({ id:'iq11', chapterId:'c39', partId:'p14', type:'deep', difficulty:'intermediate', tags:['interview','subnetting','cidr'],
    front:{ title:'Subnetting 192.168.10.70/26', question:'For the classless IP address 192.168.10.70/26, calculate: Network address, Broadcast address, Number of usable host addresses.', category:'Interview' },
    back:{ explanation:'/26 â‡’ 26 network bits, 6 host bits, mask 255.255.255.192, block size 64 (2^6). Subnet ranges: .0â€“.63, .64â€“.127, .128â€“.191, .192â€“.255, so 192.168.10.70 is in 192.168.10.64/26.',
      internals:'Network: 192.168.10.64. Broadcast: 192.168.10.127. Usable hosts: 64âˆ’2 = 62. Usable range: 192.168.10.65â€“192.168.10.126.',
      why:'Correct subnetting is essential for addressing, routing, and segmentation.', example:'Next subnet starts at 192.168.10.128/26.', related:['CIDR','Subnet Mask'] } }),

  c({ id:'iq12', chapterId:'c39', partId:'p14', type:'how', difficulty:'intermediate', tags:['interview','dhcp','dora'],
    front:{ title:'DHCP DORA Process', question:'Explain the DHCP DORA process.', category:'Interview' },
    back:{ explanation:'DORA is the IPv4 DHCP sequence: Discover (client broadcasts to find servers), Offer (server proposes IP/config/lease), Request (client selects an offer, commonly broadcast), Acknowledge (server confirms lease; client configures settings). Leases are time-limited and renewed before expiry.',
      internals:'DHCPv4 uses UDP: servers on 67, clients on 68. Options can include mask, gateway, DNS, etc.',
      security:'Rogue DHCP and starvation attacks can disrupt or hijack clients; mitigations include DHCP snooping and segmentation.', related:['DHCP Lease','Rogue DHCP'] } }),

  c({ id:'iq13', chapterId:'c39', partId:'p14', type:'how', difficulty:'intermediate', tags:['interview','routing','gateway'],
    front:{ title:'Direct vs Default Gateway Decision', question:'How does a host decide whether to send a packet directly or through the default gateway?', category:'Interview' },
    back:{ explanation:'The host performs a routing-table lookup for the destination IP and selects the most specific (longest-prefix) matching route (with preference/metrics as applicable). If the route is on-link/directly connected, it sends directly to the destination after resolving its link-layer address. If the route specifies a next hop, it sends the frame to that routerâ€™s link-layer address while keeping the IP destination end-to-end. The default gateway is the next hop of the default route (prefix length 0) used only when no more-specific route matches.',
      internals:'IPv4 uses ARP, IPv6 uses ND for next-hop MAC resolution. Hosts may have multiple interfaces/routes.',
      example:'Traffic to another network may use a specific router instead of the default gateway if a more-specific route exists.', related:['Longest Prefix Match','ARP/ND'] } }),

  c({ id:'iq14', chapterId:'c39', partId:'p14', type:'how', difficulty:'intermediate', tags:['interview','traceroute','icmp','ttl'],
    front:{ title:'How Traceroute Works', question:'How does traceroute discover the path followed by a packet?', category:'Interview' },
    back:{ explanation:'Traceroute sends probes with increasing TTL (IPv4) / Hop Limit (IPv6). Each router decrements it; when it expires, the router typically discards the packet and returns ICMP Time Exceeded. The source of that reply identifies the hop and RTT is measured. TTL/Hop Limit increases until the destination responds appropriately (e.g., ICMP Port Unreachable for UDP probes, Echo Reply for ICMP probes, or TCP response) or max hops reached.',
      internals:'Probe types vary (UDP/ICMP/TCP) by implementation; replies may be rate-limited/filtered causing `*` timeouts.',
      security:'Traceroute shows responding forward-path hops, not every device and not necessarily the reverse path.', related:['ICMP','TTL','Path MTU'] } }),

  c({ id:'iq15', chapterId:'c39', partId:'p14', type:'deep', difficulty:'intermediate', tags:['interview','mtu','fragmentation','pmtud'],
    front:{ title:'Packet Larger than MTU', question:'What happens when an IP packet is larger than the network MTU?', category:'Interview' },
    back:{ explanation:'If a packet exceeds the next link MTU it cannot be forwarded unchanged. IPv4: routers may fragment if DF is not set (destination reassembles); if DF is set the router drops it and typically sends ICMP fragmentation-needed. IPv6: routers never fragment transit packets; they drop and send ICMPv6 Packet Too Big, so the source must send smaller packets (source may fragment with extension header; destination reassembles).',
      internals:'PMTUD uses too-big signals to discover path MTU; TCP adjusts MSS to avoid fragmentation.',
      security:'Fragmentation adds overhead and loss sensitivity; ICMP filtering can break PMTUD ("black hole MTU").', related:['MSS','DF Flag','ICMPv6'] } }),

  c({ id:'iq16', chapterId:'c39', partId:'p14', type:'compare', difficulty:'intermediate', tags:['interview','tcp','udp'],
    front:{ title:'TCP vs UDP (Interview)', question:'Compare TCP and UDP.', category:'Interview' },
    back:{ explanation:'TCP is connection-oriented, provides reliable in-order byte-stream delivery with retransmission, flow control, and congestion control. UDP is connectionless, sends independent datagrams with no built-in delivery/order/retransmission/flow/congestion guarantees; apps add reliability if needed. TCP header is variable (min 20B), UDP fixed 8B. Both use checksums (UDP checksum optional in IPv4, required in IPv6).',
      internals:'TCP preserves stream order (not message boundaries); UDP preserves datagram boundaries.',
      why:'Use TCP for correctness/ordered data (web, file transfer, email); UDP for low-overhead/timely independent messages (DNS, real-time media/gaming) where loss can be tolerated or handled.', related:['Ports','QUIC'] } }),

  c({ id:'iq17', chapterId:'c39', partId:'p14', type:'deep', difficulty:'intermediate', tags:['interview','tcp','handshake'],
    front:{ title:'Why TCP Three-Way Handshake?', question:'Why does TCP use a three-way handshake to establish a connection?', category:'Interview' },
    back:{ explanation:'To establish shared connection state, exchange and acknowledge each sideâ€™s initial sequence numbers (ISNs), and confirm bidirectional reachability. SYN carries client ISN; SYN-ACK acknowledges it and carries server ISN; final ACK confirms the client received the serverâ€™s SYN/ISN. Two messages are insufficient because the server cannot know its SYN was received without the third ACK, and the handshake also helps reject stale/duplicate connection attempts.',
      internals:'Each side chooses its own ISN; TCP is stateful, full-duplex byte-stream oriented.',
      security:'Half-open states can be abused (SYN floods); mitigations include SYN cookies and rate limiting.', related:['Sequence Numbers','SYN Flood'] } }),

  c({ id:'iq18', chapterId:'c39', partId:'p14', type:'deep', difficulty:'intermediate', tags:['interview','tcp','reliability'],
    front:{ title:'TCP Reliability & Ordering', question:'How does TCP provide reliable and ordered data delivery?', category:'Interview' },
    back:{ explanation:'TCP numbers bytes with sequence numbers, uses acknowledgments (cumulative next-expected byte; SACK can report noncontiguous ranges) to confirm receipt, and retransmits on inferred loss (timeout or duplicate ACK patterns). Out-of-order data may be buffered until gaps are filled, and only contiguous bytes are delivered to the app. Checksums detect corruption (bad segments discarded), and sequence numbers prevent duplicate delivery. Flow control (receiver window) prevents overruns; congestion control adapts sending to network conditions.',
      internals:'IP gives no explicit loss signal; TCP infers and recovers end-to-end.',
      why:'Provides an ordered, reliable byte stream abstraction over unreliable IP.', related:['Sliding Window','RTT/RTO'] } }),

  c({ id:'iq19', chapterId:'c39', partId:'p14', type:'concept', difficulty:'intermediate', tags:['interview','ports','sockets'],
    front:{ title:'Ports and Sockets', question:'How do ports and sockets allow multiple applications to use the same IP address?', category:'Interview' },
    back:{ explanation:'An IP address identifies a host/interface; transport ports identify application endpoints on that host. The OS demultiplexes incoming TCP/UDP data by protocol and destination port to the associated socket (OS communication endpoint). Multiple services share one IP using different protocol-port pairs, and many concurrent TCP connections to the same service are distinguished by the 5-tuple (src IP, src port, dst IP, dst port, protocol).',
      internals:'TCP has listening sockets and separate connected sockets per accepted connection; exclusive binding of the same local IP/protocol/port is generally restricted (OS-specific sharing exists).',
      example:'TCP 443 for web and TCP 22 for SSH on the same server IP.', related:['Ephemeral Ports','Multiplexing'] } }),

  c({ id:'iq20', chapterId:'c39', partId:'p14', type:'how', difficulty:'intermediate', tags:['interview','dns'],
    front:{ title:'DNS Resolution (Interview)', question:'How does DNS resolve a domain name into an IP address?', category:'Interview' },
    back:{ explanation:'A client asks a recursive resolver, which checks cache first. On a miss it follows delegation: root â†’ TLD â†’ authoritative name servers to obtain the answer (A for IPv4, AAAA for IPv6), follows CNAMEs if needed, returns the result, and caches it per TTL. Resolvers may be provided by ISP/org/router/public DNS; apps/OS may also cache.',
      internals:'Traditional DNS uses UDP/53; TCP/53 is used when needed (e.g., large responses, zone transfers).',
      security:'Threats include spoofing/cache poisoning and tunneling; DNSSEC/validation and monitoring help.', related:['Authoritative vs Recursive','TTL'] } }),

  c({ id:'iq21', chapterId:'c39', partId:'p14', type:'deep', difficulty:'intermediate', tags:['interview','https','tls'],
    front:{ title:'How HTTPS Secures Communication', question:'How does HTTPS secure communication between a browser and a server?', category:'Interview' },
    back:{ explanation:'HTTPS is HTTP over TLS. TLS authenticates the server (certificate chain/hostname/validity and proof of private-key possession), negotiates parameters and keys (often with ephemeral key exchange for forward secrecy), then protects HTTP data with symmetric encryption and integrity mechanisms. This provides confidentiality, integrity, and server authentication in transit.',
      internals:'HTTP/1.1 & HTTP/2 typically run over TCP+TLS; HTTP/3 uses QUIC over UDP with integrated TLS handshake functionality.',
      security:'HTTPS does not guarantee site trustworthiness or protect data after receipt; client cert auth is possible but uncommon for browsing.', related:['Certificates','PKI','TLS Handshake'] } }),

  c({ id:'iq22', chapterId:'c39', partId:'p14', type:'how', difficulty:'intermediate', tags:['interview','url','browser','networking'],
    front:{ title:'What Happens After Entering a URL?', question:'What happens in the network after a user enters a URL in a browser?', category:'Interview' },
    back:{ explanation:'Browser parses URL (scheme/host/port/path/query/fragment handled locally) and may use caches/service worker/existing connections. If needed it resolves hostname via DNS, selects an IP, and routes packets (local next hop via ARP/ND, routers forward; NAT possible). It connects (TCP for HTTP/1.1/2 or QUIC for HTTP/3), performs TLS for HTTPS, sends HTTP request, receives response (possibly via CDN/proxy/LB), fetches subresources, and renders. Steps can be skipped/reused/concurrent due to caching, connection reuse, and multiplexing.',
      internals:'End-to-end flow spans DNS, routing, link delivery, transport, TLS, and application protocols.',
      example:'Fragment (#) is not sent in HTTP requests.', related:['DNS','TCP/TLS/QUIC','Rendering'] } }),

  c({ id:'iq23', chapterId:'c39', partId:'p14', type:'troubleshoot', difficulty:'intermediate', tags:['interview','troubleshooting','wifi'],
    front:{ title:'Wiâ€‘Fi Connected but No Websites', question:'A computer is connected to Wi-Fi but cannot open any website. How would you troubleshoot the problem step by step?', category:'Interview' },
    back:{ explanation:'Troubleshoot from device outward: 1) Confirm correct SSID/signal and scope (other devices affected?). 2) Verify IP config (valid IP/mask/gateway/DNS; IPv4 169.254.x.x suggests DHCP issue). 3) Test local stack/gateway reachability. 4) Test known public IP (routing/WAN/ISP) then DNS resolution (name resolution/service/config). 5) If network/DNS OK, check captive portal, proxy/VPN, firewall/endpoint policy, browser/extensions. If multiple devices fail, focus on AP/router/firewall/WAN/DNS/ISP.',
      internals:'Ping alone is inconclusive if ICMP blocked; use appropriate connectivity tests.',
      security:'Captive portals and policy controls can block access despite link association.', example:'Public IP works but names fail â†’ DNS issue.', related:['DHCP','Default Gateway','DNS'] } }),

  c({ id:'iq24', chapterId:'c39', partId:'p14', type:'scenario', difficulty:'advanced', tags:['interview','incident-response','soc','security'],
    front:{ title:'Suspected Network Breach Response', question:'How would you respond to a suspected network security breach?', category:'Interview' },
    back:{ explanation:'Follow the org IR plan: validate/triage and assess severity/scope; contain to limit damage/lateral movement while preserving evidence; collect/preserve logs, volatile data, PCAPs/images per procedure and determine entry point, affected assets/accounts, persistence, movement, and data impact. Eradicate malicious artifacts and root cause (patch/config/access/credential rotation), recover from known-good/rebuilt systems with controlled return and verification, and monitor for recurrence. Communicate/escalate per policy and legal/regulatory obligations, then conduct lessons-learned to improve controls and response.',
      internals:'Coordinate technical, management, legal, and communications stakeholders; prioritize evidence before disruptive actions when feasible.',
      security:'Containment choices must balance speed, business impact, and forensic integrity.', related:['NIST IR','Forensics','IOC'] } }),

  c({ id:'iq25', chapterId:'c39', partId:'p14', type:'scenario', difficulty:'advanced', tags:['interview','ddos','security','resilience'],
    front:{ title:'Protecting Against DDoS Attacks', question:'Explain how you would protect an organization against DDoS attacks.', category:'Interview' },
    back:{ explanation:'Use layered defense: mitigate volumetric attacks upstream (ISP/cloud scrubbing, CDN/reverse proxy/Anycast edge) because on-prem devices cannot restore a saturated Internet link; prevent origin bypass. Apply network/connection controls and application-layer protections (rate limiting, WAF, bot management) tuned to avoid blocking legitimate users. Build resilience (redundant connectivity/DNS/load balancing/capacity across failure domains, ACLs/source validation where applicable). Continuously monitor bandwidth/flows/connections/rates/latency/errors and maintain/test a DDoS runbook (thresholds, escalation, provider contacts, actions, communications, recovery).',
      internals:'Different attacks target bandwidth, state exhaustion, or application resourcesâ€”controls must match the layer.',
      security:'Regular testing ensures technical and operational response work together.', related:['CDN','WAF','Rate Limiting','Anycast'] } }),
]
