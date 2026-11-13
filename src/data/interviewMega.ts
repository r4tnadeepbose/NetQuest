import type { Chapter, Flashcard, Part } from '../types'

export const interviewMegaPart: Part = {
  id: 'p19',
  title: 'Networking Interview Mega Pack',
  description: 'Comprehensive interview Q&A: fundamentals, OSI/TCP-IP, addressing/subnetting, routing/switching, protocols, security, troubleshooting, and modern networking.'
}

export const interviewMegaChapters: Chapter[] = [
  { id: 'im1', partId: 'p19', order: 1, title: 'Networking Fundamentals & Devices', description: 'Networks, topologies, devices, links/nodes, VPN, and core terminology.' },
  { id: 'im2', partId: 'p19', order: 2, title: 'OSI/TCP-IP, Addressing & Delivery', description: 'Layer models, encapsulation, MAC/IP/ARP, IPv4/IPv6, subnetting, ports/sockets.' },
  { id: 'im3', partId: 'p19', order: 3, title: 'Transport, DNS, HTTP & Core Protocols', description: 'TCP/UDP behavior, reliability, DNS, DHCP/NAT, HTTP/HTTPS/TLS, ICMP/MTU.' },
  { id: 'im4', partId: 'p19', order: 4, title: 'Routing, Switching & Wireless', description: 'Switching behavior, VLAN/STP, routing protocols, wireless standards, and WAN technologies.' },
  { id: 'im5', partId: 'p19', order: 5, title: 'Security, Troubleshooting & Modern Networks', description: 'Firewalls/IDS/IPS/VPN, attacks/defenses, diagnostics, load balancing, CDN, SDN/SD-WAN/cloud.' },
]

const f = (x: Flashcard): Flashcard => x

export const interviewMegaFlashcards: Flashcard[] = [
  f({ id:'im_f1', chapterId:'im1', partId:'p19', type:'concept', difficulty:'beginner', tags:['network','link','node'],
    front:{ title:'Network, Link, Node, Backbone', question:'Define a computer network, link, node, and backbone network.', category:'Interview' },
    back:{ explanation:'A computer network is interconnected devices that communicate and share resources using standard protocols. A link is the connectivity/media/protocols between two devices. A node is any device/point in a network (host, switch, router, printer). A backbone is a high-capacity centralized infrastructure that interconnects network segments and distributes traffic.',
      why:'These terms describe basic network structure and scale.', related:['LAN','WAN','Topology'] } }),

  f({ id:'im_f2', chapterId:'im1', partId:'p19', type:'compare', difficulty:'beginner', tags:['pan','lan','man','wan'],
    front:{ title:'PAN, LAN, MAN, WAN', question:'Compare PAN, LAN, MAN, and WAN with examples.', category:'Interview' },
    back:{ explanation:'PAN (Personal Area Network): very short range around a person (Bluetooth). LAN (Local Area Network): home/office/building, high speed, low latency, usually privately owned (Ethernet/Wi‑Fi). MAN (Metropolitan Area Network): spans a city/campus or metro area (metro Ethernet). WAN (Wide Area Network): spans large geographic areas/countries via provider links (Internet, MPLS, SD-WAN).',
      why:'Network type affects speed, latency, ownership, cost, and technologies.', related:['Internet','Enterprise Network'] } }),

  f({ id:'im_f3', chapterId:'im1', partId:'p19', type:'concept', difficulty:'beginner', tags:['topology'],
    front:{ title:'Network Topologies', question:'What is network topology? Describe bus, star, ring, mesh, tree, and hybrid.', category:'Interview' },
    back:{ explanation:'Topology is the physical/logical arrangement of devices and links. Bus: shared backbone cable (single failure point). Star: all nodes connect to central switch/hub (easy to manage; center is critical). Ring: nodes in a loop (legacy/token-passing variants). Mesh: devices interconnected with multiple paths (high resilience, higher cost). Tree: hierarchical combination of star/bus. Hybrid: combination of topologies.',
      why:'Topology influences fault tolerance, performance, scalability, and troubleshooting.', security:'Redundant paths (mesh) can reduce single points of failure.', related:['Collision Domain','Redundancy'] } }),

  f({ id:'im_f4', chapterId:'im1', partId:'p19', type:'compare', difficulty:'beginner', tags:['hub','switch','router','bridge','gateway','nic'],
    front:{ title:'Core Network Devices', question:'Differentiate hub, switch, bridge, router, gateway, NIC, and repeater.', category:'Interview' },
    back:{ explanation:'Hub/Repeater (L1): repeat signals; hub floods all ports (one collision domain). Bridge (L2): connects segments and filters/forwards by MAC. Switch (multiport bridge, L2): forwards frames to specific ports using MAC table; per-port collision domains. Router (L3): forwards packets between networks using IP/routing table. Gateway: connects dissimilar networks/protocols and may translate. NIC: hardware interface with MAC address connecting a device to network.',
      internals:'Layer 3 switches route in hardware for fast inter-VLAN/LAN routing but routers often provide richer WAN/edge features.',
      why:'Device choice determines forwarding behavior, segmentation, and performance.', related:['MAC Table','Routing Table'] } }),

  f({ id:'im_f5', chapterId:'im1', partId:'p19', type:'concept', difficulty:'beginner', tags:['vpn'],
    front:{ title:'VPN Types and Uses', question:'What is a VPN? Explain common VPN types and benefits.', category:'Interview' },
    back:{ explanation:'A VPN creates a secure, encrypted tunnel over an untrusted network (Internet) to access private resources. Types: Remote Access VPN (user-to-network), Site-to-Site VPN (network-to-network; intranet/extranet). Protocols/technologies include IPsec, SSL/TLS VPN, L2TP, GRE (often combined).',
      why:'Provides confidentiality, integrity, and remote connectivity; can reduce WAN costs vs dedicated links.',
      security:'VPN protects traffic in transit but does not replace endpoint security, access control, or zero-trust principles; trust/latency depend on design.', example:'Employee connects securely to office network from home.', related:['IPsec','TLS','Zero Trust'] } }),

  f({ id:'im_f6', chapterId:'im1', partId:'p19', type:'concept', difficulty:'beginner', tags:['client-server','p2p'],
    front:{ title:'Client-Server vs Peer-to-Peer', question:'Compare client-server and peer-to-peer architectures.', category:'Interview' },
    back:{ explanation:'Client-server: centralized servers provide services/resources to clients (web, email, databases); easier management/security/control but server can be bottleneck/SPOF without redundancy. Peer-to-peer: nodes act as both clients and servers sharing resources directly (some file-sharing/collaboration); can be resilient/distributed but harder to manage and secure consistently.',
      why:'Architecture impacts scalability, control, performance, and security model.', related:['SPOF','Distributed Systems'] } }),

  f({ id:'im_f7', chapterId:'im1', partId:'p19', type:'concept', difficulty:'intermediate', tags:['bandwidth','latency','throughput','jitter'],
    front:{ title:'Bandwidth, Latency, Throughput, Jitter, RTT', question:'Differentiate bandwidth, latency, throughput, jitter, and RTT.', category:'Interview' },
    back:{ explanation:'Bandwidth: maximum data rate capacity (bps). Throughput: actual achieved data rate. Latency: delay for data to travel (one-way components include propagation, transmission, processing, queuing). RTT: round-trip time for request+response (ping). Jitter: variation in packet delay, critical for real-time voice/video.',
      internals:'High bandwidth does not guarantee low latency (e.g., satellite links).',
      why:'Performance troubleshooting requires identifying which metric is the bottleneck.', example:'Streaming may need low jitter and sufficient throughput more than minimal latency alone.', related:['BDP','QoS'] } }),

  f({ id:'im_f2b', chapterId:'im2', partId:'p19', type:'deep', difficulty:'intermediate', tags:['osi','tcpip','encapsulation'],
    front:{ title:'OSI vs TCP/IP and Encapsulation', question:'Explain OSI and TCP/IP models and how encapsulation works across layers.', category:'Interview' },
    back:{ explanation:'OSI (7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application) is a reference model for reasoning; TCP/IP (commonly 4: Link, Internet, Transport, Application) reflects deployed Internet protocols. Encapsulation: each sender layer adds headers (and sometimes trailers) around upper-layer payload (segment/packet/frame/bits); decapsulation reverses this at receiver.',
      why:'Layering enables interoperability, modular design, and targeted troubleshooting by isolating where failures occur.',
      example:'HTTP → TCP segment (ports/seq) → IP packet (IPs) → Ethernet frame (MACs/FCS) → signals.', related:['PDU','Troubleshooting'] } }),

  f({ id:'im_f8', chapterId:'im2', partId:'p19', type:'concept', difficulty:'beginner', tags:['ip','ipv4','ipv6','public','private'],
    front:{ title:'IP Addressing: IPv4/IPv6, Public/Private, Special Ranges', question:'Explain IPv4 vs IPv6 and key address types/ranges (private, loopback, APIPA, multicast).', category:'Interview' },
    back:{ explanation:'IPv4: 32-bit (dotted decimal, ~4.3B). IPv6: 128-bit (hex, vast space), simpler base header, no broadcast, uses NDP (ICMPv6). Public IPs are globally routable/unique; private IPv4 (RFC1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are not Internet-routable and often use NAT. Special: loopback 127.0.0.0/8 (::1), link-local/APIPA 169.254.0.0/16 (DHCP failure), multicast 224.0.0.0/4 (IPv4).',
      why:'Addressing determines reachability, routing, and configuration requirements.',
      security:'Private addressing/NAT provides isolation benefits but is not a security boundary by itself.', related:['CIDR','NAT','Dual Stack'] } }),

  f({ id:'im_f9', chapterId:'im2', partId:'p19', type:'deep', difficulty:'intermediate', tags:['subnetting','cidr','vlsm'],
    front:{ title:'Subnetting, CIDR, VLSM, and Default Gateway', question:'Explain subnetting/CIDR/VLSM and how a host decides to use the default gateway.', category:'Interview' },
    back:{ explanation:'Subnet mask/CIDR prefix splits network vs host bits to create subnets (e.g., /26 gives 64 addresses, 62 usable). CIDR enables classless aggregation; VLSM allocates different subnet sizes efficiently. A host does longest-prefix route lookup: if destination is on-link, send directly (resolve destination MAC/NDP); if off-link, send to next hop/default gateway’s MAC while keeping destination IP unchanged.',
      internals:'Network/broadcast addresses are typically reserved in IPv4 subnets; default route is 0.0.0.0/0 or ::/0.',
      example:'192.168.10.70/26 → network 192.168.10.64, broadcast 192.168.10.127, usable 62.', related:['Longest Prefix Match','ARP'] } }),

  f({ id:'im_f10', chapterId:'im2', partId:'p19', type:'concept', difficulty:'intermediate', tags:['mac','arp','ndp'],
    front:{ title:'MAC Address, ARP, and IPv6 NDP', question:'How do MAC addresses work with IP, and how are link-layer addresses resolved?', category:'Interview' },
    back:{ explanation:'MAC is a L2 hardware identifier used for local delivery; IP is a L3 logical address used for end-to-end routing. IPv4 uses ARP (broadcast request/reply, cached) to map next-hop IP to MAC on local link; IPv6 uses ICMPv6 Neighbor Discovery (NS/NA) for resolution, router discovery, and related functions. For remote destinations, frames target the next-hop router’s MAC each hop.',
      security:'ARP spoofing/poisoning and rogue NDP can enable MITM; defenses include DAI, DHCP snooping/RA guard, segmentation.', related:['Switching','Routing'] } }),

  f({ id:'im_f11', chapterId:'im2', partId:'p19', type:'concept', difficulty:'intermediate', tags:['ports','sockets','ephemeral'],
    front:{ title:'Ports, Sockets, and Multiplexing', question:'What are ports and sockets? How do multiple apps share one IP (including ephemeral ports)?', category:'Interview' },
    back:{ explanation:'A port identifies a service/process endpoint (0-65535: well-known 0-1023, registered 1024-49151, dynamic/ephemeral typically 49152-65535). A socket endpoint is identified by IP, port, and protocol; TCP connections are distinguished by the 5-tuple (src IP, src port, dst IP, dst port, protocol). Clients usually use ephemeral source ports for outbound connections.',
      example:'Same server IP can serve HTTPS on TCP/443 and SSH on TCP/22 concurrently.',
      why:'Ports enable transport-layer demultiplexing to the correct application.', related:['TCP','UDP'] } }),

  f({ id:'im_f12', chapterId:'im3', partId:'p19', type:'compare', difficulty:'intermediate', tags:['tcp','udp'],
    front:{ title:'TCP vs UDP (When to Use)', question:'Compare TCP and UDP, including use cases and trade-offs.', category:'Interview' },
    back:{ explanation:'TCP: connection-oriented, reliable ordered byte stream with retransmission, flow/congestion control (web, file transfer, email, SSH). UDP: connectionless datagrams, no built-in reliability/order/flow/congestion control, lower overhead/latency (DNS, VoIP, streaming, gaming, QUIC). Apps can add reliability over UDP when needed.',
      internals:'TCP uses sequence/ACK numbers and state; UDP header is minimal (ports, length, checksum).',
      why:'Choose based on correctness/ordering needs vs timeliness/overhead.', security:'Both can be abused (SYN floods target TCP state; UDP amplification targets bandwidth).', related:['QUIC','Sockets'] } }),

  f({ id:'im_f13', chapterId:'im3', partId:'p19', type:'deep', difficulty:'intermediate', tags:['tcp','handshake','termination','reliability'],
    front:{ title:'TCP Handshake, Termination, Reliability, and Congestion Control', question:'Explain TCP 3-way handshake, 4-way termination/TIME_WAIT, reliability/ordering, flow vs congestion control, and retransmission.', category:'Interview' },
    back:{ explanation:'Handshake: SYN (client ISN) → SYN-ACK (server ISN + ack) → ACK establishes state and bidirectional confirmation. Termination: FIN/ACK exchanges close each direction; TIME_WAIT allows delayed packets to expire and final ACK retransmission if needed. Reliability/ordering: sequence/ACKs, retransmissions (RTO/duplicate ACK fast retransmit), buffering/reassembly, checksum/duplicate detection. Flow control (rwnd) protects receiver; congestion control (cwnd: slow start, congestion avoidance, AIMD/fast recovery; algorithms like Reno/CUBIC/BBR) protects network.',
      internals:'Sender rate limited by min(cwnd,rwnd). ECN can signal congestion without drops.',
      security:'SYN floods exhaust half-open state; mitigations include SYN cookies, rate limiting, timeouts.', related:['Sliding Window','RTO','Ports'] } }),

  f({ id:'im_f14', chapterId:'im3', partId:'p19', type:'concept', difficulty:'intermediate', tags:['dns','dhcp','nat'],
    front:{ title:'DNS, DHCP (DORA), and NAT/PAT', question:'Explain DNS resolution/caching/records, DHCP DORA/APIPA, and NAT/PAT.', category:'Interview' },
    back:{ explanation:'DNS resolves names to IPs via cache then recursive hierarchy (root→TLD→authoritative), caching by TTL; records include A/AAAA, CNAME, MX, NS, TXT. DHCPv4 DORA: Discover, Offer, Request, Acknowledge assigns IP/mask/gateway/DNS lease; APIPA 169.254.x.x indicates DHCP failure. NAT translates private↔public addresses; PAT/NAPT multiplexes many internal hosts on one public IP using ports/state table.',
      security:'DNS threats include spoofing/cache poisoning/tunneling (mitigate with DNSSEC, trusted resolvers, monitoring). Rogue DHCP/starvation can misconfigure clients (DHCP snooping). NAT is not a firewall.',
      example:'Ping 8.8.8.8 works but names fail → likely DNS issue.', related:['ICMP','Default Gateway','TTL'] } }),

  f({ id:'im_f15', chapterId:'im3', partId:'p19', type:'deep', difficulty:'intermediate', tags:['http','https','tls'],
    front:{ title:'HTTP/HTTPS, TLS, and What Happens When You Open a URL', question:'Compare HTTP vs HTTPS and summarize the network flow when opening a URL.', category:'Interview' },
    back:{ explanation:'HTTP is application protocol for web resources (stateless; cookies add state). HTTPS is HTTP over TLS providing encryption, integrity, and server authentication (not a guarantee of site safety). Flow: parse URL → cache checks → DNS resolve → route (ARP/ND, routing, possible NAT) → TCP (or QUIC for HTTP/3) → TLS handshake for HTTPS → HTTP request/response → fetch/render resources. HTTP/1.1 vs HTTP/2 (multiplexing/compression over TCP) vs HTTP/3 (QUIC over UDP, reduced HOL blocking/faster setup).',
      internals:'GET is typically safe/idempotent; POST changes state. Ports: 80/443.',
      security:'Validate certs/hostname; use HSTS/cookies flags (HttpOnly/Secure/SameSite) appropriately.', related:['DNS','QUIC','CDN'] } }),

  f({ id:'im_f16', chapterId:'im3', partId:'p19', type:'concept', difficulty:'intermediate', tags:['icmp','mtu','pmtud','traceroute','ping'],
    front:{ title:'ICMP, Ping/Traceroute, MTU and PMTUD', question:'Explain ICMP diagnostics and what happens when packets exceed MTU (IPv4 vs IPv6).', category:'Interview' },
    back:{ explanation:'ICMP carries control/error messages (not app data). Ping uses Echo Request/Reply to test reachability/RTT. Traceroute discovers hops via increasing TTL/Hop Limit and ICMP Time Exceeded replies (probe types vary). MTU is max frame/payload size on a link; oversized packets: IPv4 routers may fragment if DF unset (or drop/send ICMP if DF set), IPv6 routers drop and send ICMPv6 Packet Too Big so source adjusts (PMTUD).',
      internals:'ICMP filtering can cause black-hole PMTUD issues; path may differ from reverse path.',
      example:'MSS tuning helps TCP avoid fragmentation.', related:['TTL','Fragmentation'] } }),

  f({ id:'im_f17', chapterId:'im4', partId:'p19', type:'deep', difficulty:'intermediate', tags:['switching','vlan','stp','mac-table'],
    front:{ title:'Switching, VLANs, Trunks, and STP', question:'How do switches learn/forward frames? Explain VLANs, trunk/access ports, broadcast/collision domains, and STP.', category:'Interview' },
    back:{ explanation:'Switch learns source MAC→port (per VLAN); forwards known unicast to one port, floods unknown unicast/broadcast within VLAN, filters if destination is ingress port. VLANs (802.1Q tagging on trunks) create separate L2 broadcast domains; access ports carry one VLAN. Routers/L3 switches route between VLANs. Each switch port is a separate collision domain (hubs share one). STP/RSTP/MSTP prevent L2 loops by blocking redundant paths and electing root/roles.',
      security:'Mitigate MAC flooding, VLAN hopping/misconfig, and ARP attacks with port security, proper trunking, DAI/DHCP snooping.', related:['Inter-VLAN Routing','MAC Aging'] } }),

  f({ id:'im_f18', chapterId:'im4', partId:'p19', type:'compare', difficulty:'advanced', tags:['routing','rip','ospf','eigrp','bgp'],
    front:{ title:'Routing Protocols: Static/Dynamic, IGP vs EGP, RIP/OSPF/EIGRP/BGP', question:'Compare key routing concepts and protocols (distance vector/link-state/path-vector), convergence, and use cases.', category:'Interview' },
    back:{ explanation:'Static routes are manual; dynamic protocols adapt automatically. IGPs route within an AS (RIP distance-vector, hop-count, slow convergence/count-to-infinity mitigations like split horizon/poison reverse; OSPF link-state with SPF/Dijkstra, fast convergence, areas; EIGRP hybrid/Cisco, DUAL). BGP is EGP/path-vector between ASes, policy-driven (attributes like AS_PATH/NEXT_HOP). Routers choose routes by longest-prefix match then administrative distance/metrics/policy as applicable.',
      internals:'ECMP can load-balance equal-cost paths; redistribution exchanges routes between protocols carefully to avoid loops.',
      why:'Protocol choice depends on scale, convergence, policy, and vendor/environment.', related:['Routing Table','Autonomous System'] } }),

  f({ id:'im_f19', chapterId:'im4', partId:'p19', type:'concept', difficulty:'intermediate', tags:['wireless','wifi','poe'],
    front:{ title:'Wireless Networking and PoE', question:'Summarize Wi‑Fi standards/bands/security, common wireless issues, and PoE.', category:'Interview' },
    back:{ explanation:'Wi‑Fi (IEEE 802.11) uses 2.4 GHz (longer range, more interference) and 5/6 GHz (higher throughput, shorter range). Prefer WPA2/WPA3 over WEP/WPA; SSID hiding is not security. Threats include rogue/evil twin APs and weak configs; enterprise uses 802.1X/RADIUS. PoE delivers power and data over Ethernet to devices like APs/phones/cameras, simplifying deployment.',
      internals:'Roaming, channel planning, and interference affect performance/latency/jitter.',
      security:'Use strong auth/encryption, segmentation for guest/IoT, and monitor for rogue APs.', related:['VLAN','NAC'] } }),

  f({ id:'im_f20', chapterId:'im5', partId:'p19', type:'compare', difficulty:'intermediate', tags:['firewall','ids','ips','proxy','acl'],
    front:{ title:'Network Security Controls', question:'Differentiate firewall (stateless/stateful/NGFW), ACLs, IDS vs IPS, and proxy/reverse proxy.', category:'Interview' },
    back:{ explanation:'ACLs filter traffic by rules (standard by source IP; extended by IP/protocol/port). Stateless firewalls evaluate packets independently; stateful track connections and allow related return traffic; NGFW adds app awareness/inspection. IDS detects/alerts (often passive); IPS can block inline. Forward proxy acts for clients (policy/caching/anonymity); reverse proxy fronts servers (load balancing, TLS termination, protection, routing).',
      why:'Defense-in-depth combines segmentation, filtering, monitoring, and secure configs.',
      security:'Controls must be tuned to reduce false positives/negatives and aligned with business policy.', related:['NAT','Zero Trust','WAF'] } }),

  f({ id:'im_f21', chapterId:'im5', partId:'p19', type:'troubleshoot', difficulty:'intermediate', tags:['troubleshooting','diagnostics'],
    front:{ title:'Network Troubleshooting Methodology and Tools', question:'How do you troubleshoot connectivity issues? Mention key tools (ping, traceroute, ipconfig/ifconfig, nslookup/dig, netstat, tcpdump/Wireshark).', category:'Interview' },
    back:{ explanation:'Work systematically bottom-up: physical/link and correct network → IP config (DHCP/APIPA, mask/gateway/DNS) → local gateway reachability → remote IP reachability/routing → name resolution → port/service/app/TLS/firewall/proxy. Tools: ping (ICMP reachability/RTT), traceroute/tracert (path/TTL), ipconfig/ifconfig/ip (config), nslookup/dig (DNS), netstat/ss (ports/connections), arp (L2 mapping), tcpdump/Wireshark (packet analysis).',
      example:'Can ping IP but not domain → DNS issue. 169.254.x.x → DHCP failure.',
      security:'ICMP/ports may be filtered; findings must be interpreted in context.', related:['OSI Layers','Logs','PMTUD'] } }),

  f({ id:'im_f22', chapterId:'im5', partId:'p19', type:'scenario', difficulty:'advanced', tags:['ddos','mitm','dns-poisoning','arp-spoofing'],
    front:{ title:'Common Network Attacks and Defenses', question:'Summarize common attacks (DDoS, MITM, ARP/DNS spoofing, SYN flood, evil twin) and layered defenses.', category:'Interview' },
    back:{ explanation:'DDoS exhausts bandwidth/state/app resources (mitigate upstream scrubbing/CDN/Anycast, rate limiting/WAF, redundancy/runbooks). MITM intercepts/tampers traffic (TLS, cert validation, secure configs). ARP spoofing poisons L2 mappings (DAI, DHCP snooping, segmentation). DNS spoofing/cache poisoning redirects names (DNSSEC, trusted resolvers). SYN floods target TCP backlog (SYN cookies, filtering, scaling). Evil twin rogue APs lure Wi‑Fi clients (WPA2/3-Enterprise, 802.1X, monitoring).',
      why:'Defense-in-depth, monitoring, patching, and segmentation reduce likelihood and impact.',
      security:'Perform testing and incident response only in authorized environments.', related:['Incident Response','Zero Trust'] } }),

  f({ id:'im_f23', chapterId:'im5', partId:'p19', type:'concept', difficulty:'advanced', tags:['cdn','load-balancing','qos','sdn','sdwan','cloud'],
    front:{ title:'Modern Networking: Load Balancing, CDN, QoS, SDN/SD-WAN, Cloud/Automation', question:'Explain load balancing (L4/L7), CDN, QoS, SDN/SD-WAN, and network automation/virtualization.', category:'Interview' },
    back:{ explanation:'Load balancers distribute traffic and health-check backends (L4 by IP/port, fast; L7 by HTTP content/headers, smarter with TLS termination/routing). CDNs cache/serve content near users to reduce latency and origin load. QoS prioritizes critical traffic (classification/marking/queuing/shaping). SDN separates control/data planes for centralized programmability; SD-WAN applies this to WAN path selection over MPLS/broadband/LTE. Automation (Ansible/Python/controllers), virtualization (VXLAN/overlays), and cloud networking (VPC/VNet) improve agility and scale.',
      why:'Modern systems optimize for performance, resilience, security, and operational efficiency at scale.',
      example:'Anycast + CDN + WAF absorb spikes and protect origins.', related:['Redundancy','Observability'] } }),

  f({ id:'im_f24', chapterId:'im5', partId:'p19', type:'scenario', difficulty:'advanced', tags:['url-flow','web'],
    front:{ title:'End-to-End: URL to Page Render', question:'Walk through what happens from entering a URL to seeing a webpage, including possible caches/CDN and security.', category:'Interview' },
    back:{ explanation:'Browser parses URL and checks caches/service worker/HSTS; resolves DNS (local/recursive/authoritative, cached by TTL); chooses route to server IP (gateway/ARP-ND, routers, NAT possible). Establishes transport (TCP handshake or QUIC) and TLS for HTTPS (cert validation, key exchange). Sends HTTP request (possibly through proxy/LB/CDN) and receives response; fetches subresources in parallel, applies caching/compression, builds DOM/CSSOM/render tree and paints. Many steps may be reused, skipped, or multiplexed (HTTP/2/3).',
      security:'HTTPS protects in transit; content/security policies and cookies flags affect app-layer security.',
      why:'This question tests understanding across DNS, routing, transport, TLS, HTTP, and performance.', related:['DORA','PMTUD','Keep-Alive'] } }),
]