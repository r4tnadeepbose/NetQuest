import type { SimCategory, SimDefinition } from './types'

const dns: SimDefinition = {
  id: 'dns-resolution', title: 'DNS Resolution (Recursive)', category: 'dns-internet',
  summary: 'Resolve a domain name to an IP address via recursive DNS.',
  description: 'Step-by-step recursive DNS lookup with caching and TTL behavior.',
  devices: [
    { id:'client', label:'Client/Browser', kind:'Host', role:'client', x:40,y:180,w:150,h:70, meta:{IP:'192.168.1.20', Action:'Enter www.example.com'} },
    { id:'cache', label:'Local DNS Cache', kind:'Cache', role:'other', x:240,y:60,w:150,h:60, meta:{Scope:'Browser/OS cache'} },
    { id:'resolver', label:'Recursive Resolver', kind:'DNS Resolver', role:'dns', x:260,y:180,w:170,h:70, meta:{IP:'8.8.8.8 (example)', Cache:'Enabled'} },
    { id:'root', label:'Root DNS', kind:'Root Server', role:'dns', x:520,y:40,w:150,h:60, meta:{Zone:'.'} },
    { id:'tld', label:'TLD DNS', kind:'.com Server', role:'dns', x:720,y:140,w:150,h:60, meta:{Zone:'.com'} },
    { id:'auth', label:'Authoritative DNS', kind:'example.com', role:'dns', x:720,y:300,w:170,h:70, meta:{Zone:'example.com', Record:'A 93.184.216.34'} },
    { id:'web', label:'Web Server', kind:'Destination', role:'server', x:480,y:300,w:160,h:70, meta:{IP:'93.184.216.34', Port:'443'} },
  ],
  links: [
    {id:'l1',from:'client',to:'cache',dashed:true},
    {id:'l2',from:'client',to:'resolver'},
    {id:'l3',from:'resolver',to:'root',curve:40},
    {id:'l4',from:'resolver',to:'tld',curve:-20},
    {id:'l5',from:'resolver',to:'auth',curve:40},
    {id:'l6',from:'client',to:'web'},
  ],
  events: [
    {id:'e1',at:0,dur:1200,from:'client',to:'cache',packet:{id:'p1',label:'Cache check',protocol:'Local',color:'#6e6e73',explanation:'Browser/OS checks local DNS cache first.'},stepTitle:'Check local cache',stepDetail:'If cached and TTL valid, answer is returned immediately.'},
    {id:'e2',at:1200,dur:1400,from:'cache',to:'client',packet:{id:'p2',label:'Cache miss',protocol:'Local',color:'#ff9f0a',explanation:'No valid cached record found.'},stepTitle:'Cache miss',stepDetail:'Client must query a recursive resolver.'},
    {id:'e3',at:2600,dur:1400,from:'client',to:'resolver',packet:{id:'p3',label:'DNS Query (A)',protocol:'DNS/UDP',color:'#0071e3',fields:{QNAME:'www.example.com',QTYPE:'A',RD:'1'},explanation:'Recursive query sent to resolver.'},stepTitle:'Query recursive resolver',stepDetail:'Resolver will perform lookups on behalf of client.'},
    {id:'e4',at:4000,dur:1400,from:'resolver',to:'root',packet:{id:'p4',label:'Query root',protocol:'DNS',color:'#af52de',fields:{QNAME:'www.example.com'},explanation:'Ask root where to find .com.'},stepTitle:'Ask root server',stepDetail:'Root does not know final answer but refers to TLD.'},
    {id:'e5',at:5400,dur:1400,from:'root',to:'resolver',packet:{id:'p5',label:'Referral .com',protocol:'DNS',color:'#af52de',fields:{Referral:'TLD servers for .com'},explanation:'Root responds with TLD name server delegation.'},stepTitle:'Root referral'},
    {id:'e6',at:6800,dur:1400,from:'resolver',to:'tld',packet:{id:'p6',label:'Query .com',protocol:'DNS',color:'#ff9f0a',fields:{QNAME:'www.example.com'},explanation:'Ask .com TLD for authoritative servers.'},stepTitle:'Ask TLD server'},
    {id:'e7',at:8200,dur:1400,from:'tld',to:'resolver',packet:{id:'p7',label:'Referral auth',protocol:'DNS',color:'#ff9f0a',fields:{Referral:'Authoritative NS for example.com'},explanation:'TLD delegates to authoritative server.'},stepTitle:'TLD referral'},
    {id:'e8',at:9600,dur:1400,from:'resolver',to:'auth',packet:{id:'p8',label:'Query auth',protocol:'DNS',color:'#34c759',fields:{QNAME:'www.example.com',QTYPE:'A'},explanation:'Ask authoritative server for the record.'},stepTitle:'Ask authoritative server'},
    {id:'e9',at:11000,dur:1400,from:'auth',to:'resolver',packet:{id:'p9',label:'A record',protocol:'DNS',color:'#34c759',fields:{Answer:'93.184.216.34',TTL:'300'},explanation:'Authoritative answer returned with TTL.'},stepTitle:'Authoritative answer',stepDetail:'Resolver caches answer according to TTL.'},
    {id:'e10',at:12400,dur:1400,from:'resolver',to:'client',packet:{id:'p10',label:'Resolved IP',protocol:'DNS',color:'#34c759',fields:{Answer:'93.184.216.34'},explanation:'Resolver returns IP to client.'},stepTitle:'Return result to client'},
    {id:'e11',at:13800,dur:1600,from:'client',to:'web',packet:{id:'p11',label:'Connect (TCP/TLS)',protocol:'TCP/HTTPS',color:'#0071e3',explanation:'Browser can now connect to resolved IP.'},stepTitle:'Connect to destination',stepDetail:'Subsequent lookups may be served from cache until TTL expires.'},
  ],
  totalDuration: 16000,
  beginner: [
    'DNS translates human-friendly names (like www.example.com) into IP addresses.',
    'Your device asks a recursive resolver, which may ask root, TLD, and authoritative servers.',
    'Answers are cached for a TTL period to speed up future lookups.',
  ],
  advanced: [
    'Resolution can be recursive (client→resolver) and iterative between resolver and hierarchy servers.',
    'Records include A/AAAA/CNAME/MX/NS/TXT; DNSSEC can validate integrity of responses.',
    'Failures can occur due to NXDOMAIN, SERVFAIL, timeouts, misdelegation, or cache issues.',
  ],
  failureNote: 'If DNS fails, browsers cannot resolve names (IP-based connectivity may still work). Troubleshoot cache, resolver reachability, records, and filtering.',
}

const dhcp: SimDefinition = {
  id:'dhcp-dora', title:'DHCP DORA Process', category:'protocols',
  summary:'Client obtains IP configuration via Discover, Offer, Request, Acknowledge.',
  description:'Animated DHCPv4 lease assignment with key configuration fields.',
  devices:[
    {id:'client',label:'Client',kind:'New Host',role:'client',x:120,y:170,w:160,h:70,meta:{MAC:'AA:BB:CC:11:22:33',IP:'0.0.0.0'}},
    {id:'net',label:'Broadcast Domain',kind:'LAN',role:'other',x:420,y:80,w:160,h:60,meta:{Scope:'Local subnet'}},
    {id:'server',label:'DHCP Server',kind:'Server',role:'server',x:700,y:170,w:170,h:70,meta:{Pool:'192.168.1.100-200',Gateway:'192.168.1.1',DNS:'8.8.8.8',Lease:'24h'}},
  ],
  links:[{id:'l1',from:'client',to:'net'},{id:'l2',from:'net',to:'server'}],
  events:[
    {id:'d1',at:0,dur:1500,from:'client',to:'net',packet:{id:'dp1',label:'DISCOVER',protocol:'DHCP',color:'#af52de',fields:{Src:'0.0.0.0:68',Dst:'255.255.255.255:67',Msg:'DHCPDISCOVER'},explanation:'Client broadcasts to find DHCP servers.'},stepTitle:'1. Discover',stepDetail:'Broadcast request from client with no IP.'},
    {id:'d2',at:1500,dur:1500,from:'net',to:'server',packet:{id:'dp2',label:'DISCOVER',protocol:'DHCP',color:'#af52de'},stepTitle:'Discover reaches server'},
    {id:'d3',at:3000,dur:1500,from:'server',to:'net',packet:{id:'dp3',label:'OFFER',protocol:'DHCP',color:'#ff9f0a',fields:{OfferedIP:'192.168.1.120',Mask:'255.255.255.0',Gateway:'192.168.1.1',Lease:'86400s'},explanation:'Server offers an available address and options.'},stepTitle:'2. Offer'},
    {id:'d4',at:4500,dur:1500,from:'net',to:'client',packet:{id:'dp4',label:'OFFER',protocol:'DHCP',color:'#ff9f0a'},stepTitle:'Offer delivered'},
    {id:'d5',at:6000,dur:1500,from:'client',to:'net',packet:{id:'dp5',label:'REQUEST',protocol:'DHCP',color:'#0071e3',fields:{RequestedIP:'192.168.1.120'},explanation:'Client requests the offered lease (broadcast).'},stepTitle:'3. Request'},
    {id:'d6',at:7500,dur:1500,from:'net',to:'server',packet:{id:'dp6',label:'REQUEST',protocol:'DHCP',color:'#0071e3'},stepTitle:'Request reaches server'},
    {id:'d7',at:9000,dur:1500,from:'server',to:'net',packet:{id:'dp7',label:'ACK',protocol:'DHCP',color:'#34c759',fields:{IP:'192.168.1.120',DNS:'8.8.8.8'},explanation:'Server confirms lease; client can configure interface.'},stepTitle:'4. Acknowledge',stepDetail:'Client applies IP/mask/gateway/DNS and tracks lease timers.'},
    {id:'d8',at:10500,dur:1500,from:'net',to:'client',packet:{id:'dp8',label:'ACK',protocol:'DHCP',color:'#34c759'},stepTitle:'Lease confirmed'},
  ],
  totalDuration: 12500,
  beginner:['DHCP automatically assigns IP settings to devices.','DORA: Discover, Offer, Request, Acknowledge.','Devices receive IP, subnet mask, gateway, DNS, and lease time.'],
  advanced:['DHCPv4 uses UDP ports 67/68 and broadcasts in initial stages; relays can forward across subnets.','Clients renew before lease expiry (T1/T2). Options convey configuration.'],
  failureNote:'If no DHCP server responds, hosts may self-assign APIPA/link-local addresses and fail to reach off-link networks.'
}

const arp: SimDefinition = {
  id:'arp-resolution', title:'ARP Resolution (IPv4)', category:'protocols',
  summary:'Resolve next-hop IPv4 address to a MAC address on a local link.',
  description:'ARP request broadcast and reply used before sending Ethernet frames.',
  devices:[
    {id:'a',label:'Host A',kind:'Client',role:'client',x:100,y:170,w:150,h:70,meta:{IP:'192.168.1.10',MAC:'AA:AA:AA:AA:AA:01',ARP:'empty'}},
    {id:'sw',label:'Switch',kind:'L2 Switch',role:'switch',x:420,y:170,w:150,h:70,meta:{Action:'Floods broadcast'}},
    {id:'b',label:'Host B',kind:'Target',role:'server',x:740,y:90,w:150,h:70,meta:{IP:'192.168.1.20',MAC:'BB:BB:BB:BB:BB:02'}},
    {id:'c',label:'Host C',kind:'Other',role:'other',x:740,y:250,w:150,h:70,meta:{IP:'192.168.1.30',MAC:'CC:CC:CC:CC:CC:03'}},
  ],
  links:[{id:'l1',from:'a',to:'sw'},{id:'l2',from:'sw',to:'b'},{id:'l3',from:'sw',to:'c'}],
  events:[
    {id:'a1',at:0,dur:1200,from:'a',to:'sw',packet:{id:'ap1',label:'ARP Request',protocol:'ARP',color:'#ff9f0a',fields:{Who:'192.168.1.20?',Sender:'192.168.1.10 / AA:..:01',DstMAC:'FF:FF:FF:FF:FF:FF'},explanation:'Broadcast asking who has the target IP.'},stepTitle:'ARP Request (broadcast)',stepDetail:'Needed when destination is on-link and MAC unknown.'},
    {id:'a2',at:1200,dur:1000,from:'sw',to:'b',packet:{id:'ap2',label:'ARP Request',protocol:'ARP',color:'#ff9f0a'},stepTitle:'Switch floods broadcast'},
    {id:'a3',at:1200,dur:1000,from:'sw',to:'c',packet:{id:'ap3',label:'ARP Request',protocol:'ARP',color:'#ff9f0a'},stepTitle:'All hosts receive broadcast'},
    {id:'a4',at:2400,dur:1400,from:'b',to:'sw',packet:{id:'ap4',label:'ARP Reply',protocol:'ARP',color:'#34c759',fields:{IP:'192.168.1.20',MAC:'BB:BB:BB:BB:BB:02'},explanation:'Owner replies with its MAC address.'},stepTitle:'ARP Reply (unicast)',stepDetail:'Host C ignores request (IP mismatch).'},
    {id:'a5',at:3800,dur:1200,from:'sw',to:'a',packet:{id:'ap5',label:'ARP Reply',protocol:'ARP',color:'#34c759'},stepTitle:'Reply delivered to sender'},
    {id:'a6',at:5200,dur:1400,from:'a',to:'sw',packet:{id:'ap6',label:'IPv4 Frame',protocol:'Ethernet/IPv4',color:'#0071e3',fields:{DstMAC:'BB:..:02',DstIP:'192.168.1.20'},explanation:'Frame sent to resolved MAC; IP remains destination host.'},stepTitle:'Send data frame',stepDetail:'Host A caches mapping in ARP table.'},
    {id:'a7',at:6600,dur:1200,from:'sw',to:'b',packet:{id:'ap7',label:'IPv4 Frame',protocol:'Ethernet/IPv4',color:'#0071e3'},stepTitle:'Unicast delivery'},
  ],
  totalDuration: 8200,
  beginner:['ARP maps IPv4 addresses to MAC addresses on the local network.','Request is broadcast; reply comes from the owner.','Results are cached for a short time.'],
  advanced:['ARP is link-local and unauthenticated; IPv6 uses Neighbor Discovery (ICMPv6).','For off-link destinations, hosts resolve the next-hop router MAC instead.'],
  failureNote:'ARP spoofing can poison caches and redirect traffic; defenses include Dynamic ARP Inspection and segmentation.'
}

const tcp: SimDefinition = {
  id:'tcp-handshake', title:'TCP Three-Way Handshake', category:'tcpip',
  summary:'Establish a reliable TCP connection using SYN, SYN-ACK, and ACK.',
  description:'Sequence/acknowledgment synchronization before data transfer.',
  devices:[
    {id:'c',label:'Client',kind:'Host',role:'client',x:140,y:170,w:170,h:80,meta:{Port:'49152',State:'CLOSED'}},
    {id:'s',label:'Server',kind:'Host',role:'server',x:680,y:170,w:170,h:80,meta:{Port:'443',State:'LISTEN'}},
  ],
  links:[{id:'l1',from:'c',to:'s',curve:-60},{id:'l2',from:'s',to:'c',curve:-60}],
  events:[
    {id:'t1',at:0,dur:1500,from:'c',to:'s',packet:{id:'tp1',label:'SYN',protocol:'TCP',color:'#0071e3',fields:{Seq:'1000',Ack:'-',Flags:'SYN',SrcPort:'49152',DstPort:'443'},explanation:'Client requests connection and sends initial sequence number.'},stepTitle:'1. SYN',stepDetail:'Client enters SYN-SENT.'},
    {id:'t2',at:1700,dur:1500,from:'s',to:'c',packet:{id:'tp2',label:'SYN-ACK',protocol:'TCP',color:'#ff9f0a',fields:{Seq:'5000',Ack:'1001',Flags:'SYN,ACK'},explanation:'Server acknowledges client ISN and sends its own ISN.'},stepTitle:'2. SYN-ACK',stepDetail:'Server enters SYN-RECEIVED.'},
    {id:'t3',at:3400,dur:1500,from:'c',to:'s',packet:{id:'tp3',label:'ACK',protocol:'TCP',color:'#34c759',fields:{Seq:'1001',Ack:'5001',Flags:'ACK'},explanation:'Client acknowledges server ISN; connection established.'},stepTitle:'3. ACK',stepDetail:'Both sides enter ESTABLISHED; data can flow.'},
    {id:'t4',at:5200,dur:1200,from:'c',to:'s',packet:{id:'tp4',label:'Data',protocol:'TCP',color:'#5ac8fa',fields:{Seq:'1001',Len:'512'},explanation:'Application data sent over established connection.'},stepTitle:'Data transfer'},
    {id:'t5',at:6600,dur:1200,from:'s',to:'c',packet:{id:'tp5',label:'ACK/Data',protocol:'TCP',color:'#34c759',fields:{Ack:'1513'},explanation:'Acknowledgment and/or response data.'},stepTitle:'Acknowledgment'},
  ],
  totalDuration: 8200,
  beginner:['TCP uses a 3-way handshake to start a reliable connection.','SYN and SYN-ACK exchange sequence numbers; ACK confirms.','After handshake, both sides can send data.'],
  advanced:['Sequence/ack numbers enable ordered, reliable byte streams with retransmission and flow/congestion control.','Connection termination uses FIN/ACK exchanges; resets (RST) abort abnormally.'],
  failureNote:'If SYN-ACK is lost, client retransmits SYN. SYN floods exploit half-open states (mitigated with SYN cookies/rate limiting).'
}

const osi: SimDefinition = {
  id:'osi-encapsulation', title:'OSI Encapsulation & Decapsulation', category:'osi',
  summary:'Data moving down the sender stack and up the receiver stack.',
  description:'Visualizes layer-by-layer wrapping/unwrapping of protocol data units.',
  devices:[
    {id:'app7',label:'7 Application',kind:'HTTP',role:'client',x:80,y:40,w:170,h:50,meta:{PDU:'Data'}},
    {id:'pre6',label:'6 Presentation',kind:'Format/TLS',role:'client',x:80,y:100,w:170,h:50,meta:{PDU:'Data'}},
    {id:'ses5',label:'5 Session',kind:'Dialog',role:'client',x:80,y:160,w:170,h:50,meta:{PDU:'Data'}},
    {id:'tr4',label:'4 Transport',kind:'TCP/UDP',role:'client',x:80,y:220,w:170,h:50,meta:{PDU:'Segment'}},
    {id:'net3',label:'3 Network',kind:'IP',role:'client',x:80,y:280,w:170,h:50,meta:{PDU:'Packet'}},
    {id:'dl2',label:'2 Data Link',kind:'Ethernet',role:'client',x:80,y:340,w:170,h:50,meta:{PDU:'Frame'}},
    {id:'ph1',label:'1 Physical',kind:'Bits/Signals',role:'client',x:80,y:400,w:170,h:50,meta:{PDU:'Bits'}},
    {id:'r7',label:'7 Application',kind:'HTTP',role:'server',x:700,y:40,w:170,h:50},
    {id:'r6',label:'6 Presentation',kind:'Format/TLS',role:'server',x:700,y:100,w:170,h:50},
    {id:'r5',label:'5 Session',kind:'Dialog',role:'server',x:700,y:160,w:170,h:50},
    {id:'r4',label:'4 Transport',kind:'TCP/UDP',role:'server',x:700,y:220,w:170,h:50},
    {id:'r3',label:'3 Network',kind:'IP',role:'server',x:700,y:280,w:170,h:50},
    {id:'r2',label:'2 Data Link',kind:'Ethernet',role:'server',x:700,y:340,w:170,h:50},
    {id:'r1',label:'1 Physical',kind:'Bits/Signals',role:'server',x:700,y:400,w:170,h:50},
  ],
  links:[
    {id:'d1',from:'app7',to:'pre6'},{id:'d2',from:'pre6',to:'ses5'},{id:'d3',from:'ses5',to:'tr4'},{id:'d4',from:'tr4',to:'net3'},{id:'d5',from:'net3',to:'dl2'},{id:'d6',from:'dl2',to:'ph1'},
    {id:'wire',from:'ph1',to:'r1',curve:-80},
    {id:'u1',from:'r1',to:'r2'},{id:'u2',from:'r2',to:'r3'},{id:'u3',from:'r3',to:'r4'},{id:'u4',from:'r4',to:'r5'},{id:'u5',from:'r5',to:'r6'},{id:'u6',from:'r6',to:'r7'},
  ],
  events:[
    {id:'o1',at:0,dur:700,from:'app7',to:'pre6',packet:{id:'op1',label:'Data',protocol:'App',color:'#af52de'},stepTitle:'App creates data',layer:'L7'},
    {id:'o2',at:700,dur:700,from:'pre6',to:'ses5',packet:{id:'op2',label:'Data',protocol:'Pres',color:'#af52de'},stepTitle:'Format/encode',layer:'L6'},
    {id:'o3',at:1400,dur:700,from:'ses5',to:'tr4',packet:{id:'op3',label:'Data',protocol:'Sess',color:'#af52de'},stepTitle:'Session handling',layer:'L5'},
    {id:'o4',at:2100,dur:700,from:'tr4',to:'net3',packet:{id:'op4',label:'Segment',protocol:'TCP',color:'#0071e3',fields:{SrcPort:'49152',DstPort:'443'}},stepTitle:'Add transport header',layer:'L4'},
    {id:'o5',at:2800,dur:700,from:'net3',to:'dl2',packet:{id:'op5',label:'Packet',protocol:'IP',color:'#ff9f0a',fields:{SrcIP:'10.0.0.5',DstIP:'93.184.216.34'}},stepTitle:'Add IP header',layer:'L3'},
    {id:'o6',at:3500,dur:700,from:'dl2',to:'ph1',packet:{id:'op6',label:'Frame',protocol:'Ethernet',color:'#34c759',fields:{SrcMAC:'AA:..',DstMAC:'R1:..'}},stepTitle:'Add frame header/trailer',layer:'L2'},
    {id:'o7',at:4200,dur:1200,from:'ph1',to:'r1',packet:{id:'op7',label:'Bits',protocol:'Physical',color:'#1d1d1f'},stepTitle:'Transmit on medium',layer:'L1',stepDetail:'Signals/bits traverse the physical link.'},
    {id:'o8',at:5400,dur:700,from:'r1',to:'r2',packet:{id:'op8',label:'Frame',protocol:'Ethernet',color:'#34c759'},stepTitle:'Receive bits → frame',layer:'L2'},
    {id:'o9',at:6100,dur:700,from:'r2',to:'r3',packet:{id:'op9',label:'Packet',protocol:'IP',color:'#ff9f0a'},stepTitle:'Decapsulate to packet',layer:'L3'},
    {id:'o10',at:6800,dur:700,from:'r3',to:'r4',packet:{id:'op10',label:'Segment',protocol:'TCP',color:'#0071e3'},stepTitle:'Decapsulate to segment',layer:'L4'},
    {id:'o11',at:7500,dur:700,from:'r4',to:'r5',packet:{id:'op11',label:'Data',protocol:'Sess',color:'#af52de'},stepTitle:'Deliver to session/presentation/app',layer:'L5-L7'},
    {id:'o12',at:8200,dur:700,from:'r5',to:'r6',packet:{id:'op12',label:'Data',protocol:'Pres',color:'#af52de'},stepTitle:'Reassemble for application',layer:'L6'},
    {id:'o13',at:8900,dur:700,from:'r6',to:'r7',packet:{id:'op13',label:'Data',protocol:'App',color:'#af52de'},stepTitle:'Application receives data',layer:'L7'},
  ],
  totalDuration: 10000,
  beginner:['Each layer adds its own information (encapsulation) when sending.','The receiver removes that information (decapsulation) in reverse order.','This helps networks stay modular and interoperable.'],
  advanced:['PDUs vary by layer (segment/packet/frame/bits). TCP/IP combines some OSI layers in practice.','Headers enable addressing, multiplexing, reliability, and integrity checks per scope.']
}

const journey: SimDefinition = {
  id:'packet-journey', title:'Packet Journey Across a Network', category:'tcpip',
  summary:'Follow a packet hop-by-hop with changing L2 addresses and TTL.',
  description:'Client to server across switch, router, firewall, and ISP routers.',
  devices:[
    {id:'pc',label:'Client PC',kind:'Host',role:'client',x:30,y:180,w:130,h:60,meta:{IP:'192.168.1.10',MAC:'PC:01'}},
    {id:'sw',label:'Switch',kind:'L2',role:'switch',x:190,y:180,w:120,h:60,meta:{Action:'Forward by MAC'}},
    {id:'r1',label:'Router',kind:'Gateway',role:'router',x:340,y:180,w:120,h:60,meta:{IP:'192.168.1.1',MAC:'R1:AA'}},
    {id:'fw',label:'Firewall',kind:'Security',role:'defender',x:490,y:180,w:120,h:60,meta:{Policy:'Allow 443'}},
    {id:'isp',label:'ISP Router',kind:'WAN',role:'router',x:640,y:180,w:120,h:60,meta:{Routing:'Next hop'}},
    {id:'srv',label:'Server',kind:'Web',role:'server',x:800,y:180,w:130,h:60,meta:{IP:'93.184.216.34',MAC:'SRV:99'}},
  ],
  links:[{id:'l1',from:'pc',to:'sw'},{id:'l2',from:'sw',to:'r1'},{id:'l3',from:'r1',to:'fw'},{id:'l4',from:'fw',to:'isp'},{id:'l5',from:'isp',to:'srv'}],
  events:[
    {id:'j1',at:0,dur:1200,from:'pc',to:'sw',packet:{id:'jp1',label:'Frame',protocol:'Eth/IP/TCP',color:'#0071e3',fields:{SrcIP:'192.168.1.10',DstIP:'93.184.216.34',SrcMAC:'PC:01',DstMAC:'R1:AA',TTL:'64',DstPort:'443'},explanation:'Host sends to default gateway MAC; destination IP stays the same.'},stepTitle:'Client → Switch',layer:'L2/L3'},
    {id:'j2',at:1200,dur:1200,from:'sw',to:'r1',packet:{id:'jp2',label:'Frame',protocol:'Eth/IP/TCP',color:'#0071e3'},stepTitle:'Switch forwards to router'},
    {id:'j3',at:2400,dur:1300,from:'r1',to:'fw',packet:{id:'jp3',label:'Routed packet',protocol:'IP/TCP',color:'#ff9f0a',fields:{SrcMAC:'R1:BB',DstMAC:'FW:01',TTL:'63'},explanation:'Router rewrites L2 headers per hop and decrements TTL.'},stepTitle:'Router routes (TTL-1)',stepDetail:'IP src/dst preserved unless NAT is applied.'},
    {id:'j4',at:3700,dur:1300,from:'fw',to:'isp',packet:{id:'jp4',label:'Inspected',protocol:'IP/TCP',color:'#34c759',fields:{Decision:'Allow',TTL:'62'},explanation:'Firewall inspects policy/state then forwards.'},stepTitle:'Firewall inspection'},
    {id:'j5',at:5000,dur:1300,from:'isp',to:'srv',packet:{id:'jp5',label:'Delivered',protocol:'IP/TCP',color:'#af52de',fields:{DstMAC:'SRV:99',TTL:'61'},explanation:'Final hop delivers to server network/interface.'},stepTitle:'Deliver to server'},
    {id:'j6',at:6500,dur:1500,from:'srv',to:'isp',packet:{id:'jp6',label:'Response',protocol:'HTTP/TLS',color:'#34c759',fields:{SrcIP:'93.184.216.34',DstIP:'192.168.1.10'},explanation:'Response travels back (path may differ).'},stepTitle:'Response returns'},
  ],
  totalDuration: 8400,
  beginner:['Packets pass through multiple devices to reach a destination.','MAC addresses can change at each hop, while IP addresses identify end hosts.','Routers choose the next hop toward the destination.'],
  advanced:['TTL decrements per routed hop to prevent loops; firewalls/NAT may inspect or translate traffic.','L2 is rewritten hop-by-hop; routing uses longest-prefix match and forwarding tables.']
}

const arpSpoof: SimDefinition = {
  id:'arp-spoof', title:'ARP Spoofing & Defense (Lab)', category:'red-team',
  summary:'Educational simulation of ARP cache poisoning and defensive detection.',
  description:'Authorized lab visualization contrasting attack behavior and blue-team controls.',
  devices:[
    {id:'victim',label:'Victim',kind:'Host',role:'client',x:80,y:180,w:140,h:70,meta:{IP:'192.168.1.10',GatewayMAC:'GW:11'}},
    {id:'sw',label:'Switch',kind:'L2',role:'switch',x:320,y:180,w:130,h:70,meta:{DAI:'Possible control'}},
    {id:'gw',label:'Gateway',kind:'Router',role:'router',x:560,y:80,w:140,h:70,meta:{IP:'192.168.1.1',MAC:'GW:11'}},
    {id:'att',label:'Attacker (Lab)',kind:'Simulated',role:'attacker',x:560,y:280,w:150,h:70,meta:{MAC:'AT:99'}},
    {id:'soc',label:'Blue Team Monitor',kind:'Detection',role:'defender',x:760,y:180,w:170,h:70,meta:{Signals:'ARP anomalies'}},
  ],
  links:[{id:'l1',from:'victim',to:'sw'},{id:'l2',from:'sw',to:'gw'},{id:'l3',from:'sw',to:'att'},{id:'l4',from:'sw',to:'soc',dashed:true}],
  events:[
    {id:'s1',at:0,dur:1200,from:'victim',to:'sw',packet:{id:'sp1',label:'ARP Request',protocol:'ARP',color:'#0071e3',fields:{Who:'192.168.1.1?'}},stepTitle:'Normal: who is gateway?',mode:'request'},
    {id:'s2',at:1200,dur:1200,from:'gw',to:'sw',packet:{id:'sp2',label:'Legit ARP Reply',protocol:'ARP',color:'#34c759',fields:{'192.168.1.1':'GW:11'}},stepTitle:'Legitimate mapping',mode:'response'},
    {id:'s3',at:2400,dur:1000,from:'sw',to:'victim',packet:{id:'sp3',label:'Legit ARP Reply',protocol:'ARP',color:'#34c759'},stepTitle:'Victim learns correct MAC'},
    {id:'s4',at:3800,dur:1200,from:'att',to:'sw',packet:{id:'sp4',label:'Forged ARP Reply',protocol:'ARP',color:'#ff3b30',fields:{Claim:'192.168.1.1 is AT:99'},explanation:'Attacker sends unsolicited/forged mapping (simulated).'},stepTitle:'Attack simulation: forged reply',mode:'attack'},
    {id:'s5',at:5000,dur:1000,from:'sw',to:'victim',packet:{id:'sp5',label:'Poisoned mapping',protocol:'ARP',color:'#ff3b30'},stepTitle:'Victim cache poisoned (simulated)'},
    {id:'s6',at:6200,dur:1200,from:'victim',to:'sw',packet:{id:'sp6',label:'Traffic diverted',protocol:'IP',color:'#ff9f0a',fields:{DstMAC:'AT:99 (wrong)'}},stepTitle:'Traffic may be redirected',mode:'attack'},
    {id:'s7',at:7600,dur:1200,from:'sw',to:'soc',packet:{id:'sp7',label:'Alert',protocol:'Telemetry',color:'#34c759',fields:{Signal:'MAC/IP mismatch anomaly'}},stepTitle:'Blue team detects anomaly',mode:'defense',stepDetail:'Controls: DAI, DHCP snooping, static entries, segmentation, monitoring.'},
  ],
  totalDuration: 9200,
  beginner:['ARP has no built-in authentication on local networks.','Forged replies can mislead a device about who owns an IP.','Defenders monitor for unusual MAC/IP changes.'],
  advanced:['Attack requires local segment access and specific conditions; impact ranges from disruption to interception in weakly protected environments.','Mitigations include Dynamic ARP Inspection, port security, segmentation, and encrypted protocols (which limit content exposure).'],
  failureNote:'Simulation is for authorized lab education only. Real networks vary; defenses and switch features determine feasibility and visibility.'
}

const tcpipModel: SimDefinition = {
  id:'tcpip-model', title:'TCP/IP Model (Layers & Encapsulation)', category:'tcpip',
  summary:'Visualize the 4-layer TCP/IP model and how data moves between hosts.',
  description:'Sender encapsulation down the TCP/IP stack, transmission across the network, and receiver decapsulation up the stack with mapping to OSI concepts.',
  devices:[
    {id:'app',label:'4 Application',kind:'HTTP/DNS/TLS',role:'client',x:90,y:70,w:180,h:58,meta:{PDU:'Data',OSI:'L5-L7'}},
    {id:'trn',label:'3 Transport',kind:'TCP / UDP',role:'client',x:90,y:170,w:180,h:58,meta:{PDU:'Segment/Datagram',OSI:'L4'}},
    {id:'net',label:'2 Internet',kind:'IP / ICMP',role:'client',x:90,y:270,w:180,h:58,meta:{PDU:'Packet',OSI:'L3'}},
    {id:'lnk',label:'1 Network Access',kind:'Ethernet/Wi‑Fi',role:'client',x:90,y:370,w:180,h:58,meta:{PDU:'Frame/Bits',OSI:'L1-L2'}},
    {id:'mid',label:'Network',kind:'Routers & Links',role:'other',x:430,y:220,w:160,h:70,meta:{Path:'Hops / switching / routing'}},
    {id:'rapp',label:'4 Application',kind:'HTTP/DNS/TLS',role:'server',x:700,y:70,w:180,h:58,meta:{PDU:'Data'}},
    {id:'rtrn',label:'3 Transport',kind:'TCP / UDP',role:'server',x:700,y:170,w:180,h:58,meta:{PDU:'Segment/Datagram'}},
    {id:'rnet',label:'2 Internet',kind:'IP / ICMP',role:'server',x:700,y:270,w:180,h:58,meta:{PDU:'Packet'}},
    {id:'rlnk',label:'1 Network Access',kind:'Ethernet/Wi‑Fi',role:'server',x:700,y:370,w:180,h:58,meta:{PDU:'Frame/Bits'}},
  ],
  links:[
    {id:'d1',from:'app',to:'trn'},{id:'d2',from:'trn',to:'net'},{id:'d3',from:'net',to:'lnk'},
    {id:'tx',from:'lnk',to:'mid',curve:-30},{id:'rx',from:'mid',to:'rlnk',curve:-30},
    {id:'u1',from:'rlnk',to:'rnet'},{id:'u2',from:'rnet',to:'rtrn'},{id:'u3',from:'rtrn',to:'rapp'},
  ],
  events:[
    {id:'m1',at:0,dur:900,from:'app',to:'trn',packet:{id:'mp1',label:'App Data',protocol:'HTTP',color:'#bf5af2',fields:{Example:'GET /',PDU:'Data'},explanation:'Application creates data to send.'},stepTitle:'Application data',layer:'Application'},
    {id:'m2',at:900,dur:900,from:'trn',to:'net',packet:{id:'mp2',label:'Segment',protocol:'TCP',color:'#0a84ff',fields:{SrcPort:'49152',DstPort:'443',Flags:'PSH,ACK'},explanation:'Transport adds ports and reliability/ordering (TCP) or uses UDP.'},stepTitle:'Add transport header',layer:'Transport'},
    {id:'m3',at:1800,dur:900,from:'net',to:'lnk',packet:{id:'mp3',label:'IP Packet',protocol:'IP',color:'#ff9f0a',fields:{SrcIP:'10.0.0.5',DstIP:'93.184.216.34',TTL:'64'},explanation:'Internet layer adds logical addressing and routing fields.'},stepTitle:'Add IP header',layer:'Internet'},
    {id:'m4',at:2700,dur:1100,from:'lnk',to:'mid',packet:{id:'mp4',label:'Frame/Bits',protocol:'Ethernet',color:'#30d158',fields:{SrcMAC:'AA:..',DstMAC:'GW:..'},explanation:'Network access frames data for the local link and transmits bits.'},stepTitle:'Frame and transmit',layer:'Network Access'},
    {id:'m5',at:3800,dur:1100,from:'mid',to:'rlnk',packet:{id:'mp5',label:'Frame/Bits',protocol:'Link',color:'#30d158',explanation:'Bits traverse the network path to the destination host.'},stepTitle:'Traverse network',layer:'Physical/Link'},
    {id:'m6',at:4900,dur:900,from:'rlnk',to:'rnet',packet:{id:'mp6',label:'IP Packet',protocol:'Ethernet→IP',color:'#ff9f0a',explanation:'Receiver removes link-layer framing and checks frame integrity.'},stepTitle:'Decapsulate frame',layer:'Network Access'},
    {id:'m7',at:5800,dur:900,from:'rnet',to:'rtrn',packet:{id:'mp7',label:'Segment',protocol:'IP→TCP',color:'#0a84ff',explanation:'IP header processed; packet delivered to correct transport protocol.'},stepTitle:'Decapsulate packet',layer:'Internet'},
    {id:'m8',at:6700,dur:900,from:'rtrn',to:'rapp',packet:{id:'mp8',label:'App Data',protocol:'TCP→HTTP',color:'#bf5af2',explanation:'Transport reassembles/orders data and delivers to the application.'},stepTitle:'Deliver to application',layer:'Transport → Application'},
  ],
  totalDuration: 8000,
  beginner:[
    'The TCP/IP model has 4 layers: Application, Transport, Internet, and Network Access.',
    'Data is encapsulated with headers as it goes down the sender stack and decapsulated as it goes up the receiver stack.',
    'Each layer has a role: apps/protocols, end-to-end delivery, routing across networks, and local link transmission.',
  ],
  advanced:[
    'TCP/IP maps to OSI approximately as Application≈OSI 5–7, Transport≈4, Internet≈3, Network Access≈1–2 (models differ in detail).',
    'PDUs commonly described: data, segment/datagram, packet, and frame/bits; intermediate routers process up to the Internet layer.',
    'Real stacks include additional behaviors (ARP/ND, fragmentation/PMTUD, retransmission, congestion control) not shown in this simplified diagram.',
  ],
  failureNote:'Issues at different layers cause different symptoms (e.g., DNS/app errors, TCP resets/timeouts, routing/TTL issues, or link/ARP failures).'
}

const fundamentals: SimDefinition = {
  id:'basic-network-flow', title:'Basic Client–Server Communication', category:'fundamentals',
  summary:'End-to-end request/response between a client and server across a local network and router.',
  description:'A simple network flow showing addressing, forwarding, and a response returning to the client.',
  devices:[
    {id:'client',label:'Client PC',kind:'Host',role:'client',x:60,y:190,w:150,h:70,meta:{IP:'192.168.1.10',GW:'192.168.1.1'}},
    {id:'sw',label:'Switch',kind:'LAN Switch',role:'switch',x:280,y:190,w:140,h:70,meta:{Role:'Forwards frames'}},
    {id:'r',label:'Router',kind:'Default Gateway',role:'router',x:500,y:190,w:150,h:70,meta:{LAN:'192.168.1.1',WAN:'203.0.113.1'}},
    {id:'srv',label:'Web Server',kind:'Server',role:'server',x:740,y:190,w:160,h:70,meta:{IP:'93.184.216.34',Service:'HTTPS'}},
  ],
  links:[{id:'l1',from:'client',to:'sw'},{id:'l2',from:'sw',to:'r'},{id:'l3',from:'r',to:'srv'}],
  events:[
    {id:'f1',at:0,dur:1200,from:'client',to:'sw',packet:{id:'fp1',label:'Request',protocol:'TCP/IP',color:'#0a84ff',fields:{Src:'192.168.1.10',Dst:'93.184.216.34'},explanation:'Client sends a request to the server IP (via gateway).'},stepTitle:'Client sends request'},
    {id:'f2',at:1200,dur:1000,from:'sw',to:'r',packet:{id:'fp2',label:'Request',protocol:'Ethernet',color:'#0a84ff'},stepTitle:'Switch forwards frame'},
    {id:'f3',at:2200,dur:1200,from:'r',to:'srv',packet:{id:'fp3',label:'Routed request',protocol:'IP',color:'#ff9f0a',explanation:'Router forwards packets toward the destination network.'},stepTitle:'Router forwards to destination'},
    {id:'f4',at:3600,dur:1200,from:'srv',to:'r',packet:{id:'fp4',label:'Response',protocol:'HTTPS',color:'#30d158',fields:{Status:'200 OK'},explanation:'Server processes the request and sends a response back.'},stepTitle:'Server responds'},
    {id:'f5',at:4800,dur:1000,from:'r',to:'sw',packet:{id:'fp5',label:'Response',protocol:'IP',color:'#30d158'},stepTitle:'Response routed back'},
    {id:'f6',at:5800,dur:1200,from:'sw',to:'client',packet:{id:'fp6',label:'Response',protocol:'TCP/IP',color:'#30d158'},stepTitle:'Client receives response'},
  ],
  totalDuration: 7400,
  beginner:['Networks move data between clients and servers through devices like switches and routers.','Requests go out, responses come back to the original source.','IP addresses identify endpoints; local devices use gateways to reach other networks.'],
  advanced:['Switching is typically Layer 2 (MAC) within a LAN; routing is Layer 3 (IP) between networks.','Real flows include DNS, ARP, handshakes, and multiple packets, simplified here for clarity.']
}

const switching: SimDefinition = {
  id:'switch-mac-learning', title:'Switching & MAC Learning', category:'routing-switching',
  summary:'See how a switch learns MAC addresses and forwards frames.',
  description:'A switch floods unknown destinations, learns source MAC-to-port mappings, then forwards unicast frames efficiently.',
  devices:[
    {id:'h1',label:'Host A',kind:'PC',role:'client',x:60,y:120,w:140,h:60,meta:{MAC:'AA:AA',IP:'10.0.0.1'}},
    {id:'h2',label:'Host B',kind:'PC',role:'server',x:60,y:240,w:140,h:60,meta:{MAC:'BB:BB',IP:'10.0.0.2'}},
    {id:'h3',label:'Host C',kind:'PC',role:'other',x:60,y:360,w:140,h:60,meta:{MAC:'CC:CC',IP:'10.0.0.3'}},
    {id:'sw',label:'Switch',kind:'L2 Switch',role:'switch',x:360,y:240,w:160,h:70,meta:{CAM:'Learning'}},
    {id:'cam',label:'CAM Table',kind:'MAC Table',role:'other',x:620,y:200,w:220,h:150,meta:{State:'Empty → Learned',Entries:'Port:MAC'}},
  ],
  links:[{id:'l1',from:'h1',to:'sw'},{id:'l2',from:'h2',to:'sw'},{id:'l3',from:'h3',to:'sw'},{id:'l4',from:'sw',to:'cam',dashed:true}],
  events:[
    {id:'sw1',at:0,dur:1200,from:'h1',to:'sw',packet:{id:'swp1',label:'Frame A→B',protocol:'Ethernet',color:'#0a84ff',fields:{SrcMAC:'AA:AA',DstMAC:'BB:BB'},explanation:'Switch learns source MAC AA:AA on incoming port.'},stepTitle:'Learn source MAC',stepDetail:'Unknown destination causes flooding.'},
    {id:'sw2',at:1200,dur:1000,from:'sw',to:'cam',packet:{id:'swp2',label:'Learn AA',protocol:'CAM',color:'#64d2ff'},stepTitle:'Update CAM table'},
    {id:'sw3',at:1400,dur:1000,from:'sw',to:'h2',packet:{id:'swp3',label:'Flood',protocol:'Ethernet',color:'#ff9f0a'},stepTitle:'Flood (unknown dst)'},
    {id:'sw4',at:1400,dur:1000,from:'sw',to:'h3',packet:{id:'swp4',label:'Flood',protocol:'Ethernet',color:'#ff9f0a'},stepTitle:'Flood to other ports'},
    {id:'sw5',at:2600,dur:1200,from:'h2',to:'sw',packet:{id:'swp5',label:'Reply B→A',protocol:'Ethernet',color:'#30d158',fields:{SrcMAC:'BB:BB',DstMAC:'AA:AA'},explanation:'Switch learns BB:BB; destination AA:AA is now known.'},stepTitle:'Reply and learn',stepDetail:'Known destination can be unicast.'},
    {id:'sw6',at:3800,dur:1000,from:'sw',to:'cam',packet:{id:'swp6',label:'Learn BB',protocol:'CAM',color:'#64d2ff'},stepTitle:'CAM learns BB:BB'},
    {id:'sw7',at:3900,dur:1100,from:'sw',to:'h1',packet:{id:'swp7',label:'Unicast',protocol:'Ethernet',color:'#30d158'},stepTitle:'Unicast forward to Host A'},
  ],
  totalDuration: 5400,
  beginner:['Switches learn which MAC addresses are reachable on which ports.','Unknown destinations are flooded; known destinations are forwarded directly.','This reduces unnecessary traffic compared to hubs.'],
  advanced:['CAM/ MAC tables age out entries over time; VLANs separate broadcast domains.','Attacks like MAC flooding can stress tables; controls include port security.']
}

const subnetting: SimDefinition = {
  id:'subnetting-visual', title:'Subnetting & IP Range Visualization', category:'subnetting',
  summary:'Visualize network/host portions, subnet boundaries, and usable address ranges.',
  description:'An IP block is split into subnets, showing how masks define network boundaries and host capacity.',
  devices:[
    {id:'net',label:'IP Block',kind:'192.168.1.0/24',role:'other',x:60,y:90,w:220,h:70,meta:{Hosts:'254 usable',Mask:'255.255.255.0'}},
    {id:'s1',label:'Subnet A',kind:'192.168.1.0/26',role:'cloud',x:360,y:40,w:210,h:70,meta:{Range:'192.168.1.0–63',Usable:'62'}},
    {id:'s2',label:'Subnet B',kind:'192.168.1.64/26',role:'cloud',x:360,y:150,w:210,h:70,meta:{Range:'192.168.1.64–127',Usable:'62'}},
    {id:'s3',label:'Subnet C',kind:'192.168.1.128/26',role:'cloud',x:360,y:260,w:210,h:70,meta:{Range:'192.168.1.128–191',Usable:'62'}},
    {id:'s4',label:'Subnet D',kind:'192.168.1.192/26',role:'cloud',x:360,y:370,w:210,h:70,meta:{Range:'192.168.1.192–255',Usable:'62'}},
    {id:'host',label:'Host .66',kind:'Example Host',role:'client',x:700,y:150,w:170,h:70,meta:{IP:'192.168.1.66',Subnet:'B (/26)',GW:'192.168.1.65'}},
  ],
  links:[{id:'l1',from:'net',to:'s1'},{id:'l2',from:'net',to:'s2'},{id:'l3',from:'net',to:'s3'},{id:'l4',from:'net',to:'s4'},{id:'l5',from:'s2',to:'host'}],
  events:[
    {id:'sub1',at:0,dur:1000,from:'net',to:'s1',packet:{id:'subp1',label:'/26 split',protocol:'Subnetting',color:'#0a84ff',explanation:'Borrowing bits creates smaller subnets with fewer hosts each.'},stepTitle:'Split into /26 subnets'},
    {id:'sub2',at:400,dur:1000,from:'net',to:'s2',packet:{id:'subp2',label:'/26',protocol:'Subnetting',color:'#0a84ff'},stepTitle:'Define subnet boundaries'},
    {id:'sub3',at:800,dur:1000,from:'net',to:'s3',packet:{id:'subp3',label:'/26',protocol:'Subnetting',color:'#0a84ff'},stepTitle:'Allocate ranges'},
    {id:'sub4',at:1200,dur:1000,from:'net',to:'s4',packet:{id:'subp4',label:'/26',protocol:'Subnetting',color:'#0a84ff'},stepTitle:'Plan address space'},
    {id:'sub5',at:2600,dur:1200,from:'s2',to:'host',packet:{id:'subp5',label:'Assign IP',protocol:'IPv4',color:'#30d158',fields:{IP:'192.168.1.66',Mask:'/26'},explanation:'Host belongs to Subnet B based on its IP and mask.'},stepTitle:'Place host in subnet',stepDetail:'Network/broadcast addresses are reserved per subnet.'},
  ],
  totalDuration: 4200,
  beginner:['A subnet mask splits an IP into network and host parts.','Subnetting divides a larger network into smaller networks.','Each subnet has its own network, broadcast, and usable host range.'],
  advanced:['CIDR/VLSM enable efficient allocation; routing uses longest-prefix match.','Correct boundary calculation is essential to avoid overlap and reachability issues.']
}

const wireless: SimDefinition = {
  id:'wifi-association', title:'Wireless Association & Data Flow', category:'wireless',
  summary:'Client connects to a Wi‑Fi access point and exchanges data.',
  description:'Simplified 802.11 association/authentication flow followed by data frames through an access point to the wired network.',
  devices:[
    {id:'sta',label:'Wi‑Fi Client',kind:'STA',role:'client',x:60,y:210,w:160,h:70,meta:{SSID:'CorpWiFi',Security:'WPA2/WPA3'}},
    {id:'ap',label:'Access Point',kind:'AP',role:'other',x:360,y:210,w:160,h:70,meta:{BSSID:'AP-01',Channel:'36'}},
    {id:'wlc',label:'Switch/Router',kind:'Wired Network',role:'router',x:640,y:210,w:170,h:70,meta:{Gateway:'Upstream'}},
    {id:'srv',label:'Server',kind:'Service',role:'server',x:860,y:210,w:150,h:70,meta:{App:'Web/API'}},
  ],
  links:[{id:'l1',from:'sta',to:'ap',dashed:true,label:'Wi‑Fi'},{id:'l2',from:'ap',to:'wlc'},{id:'l3',from:'wlc',to:'srv'}],
  events:[
    {id:'w1',at:0,dur:1000,from:'ap',to:'sta',packet:{id:'wp1',label:'Beacon',protocol:'802.11',color:'#64d2ff',explanation:'AP advertises network (SSID/capabilities).'},stepTitle:'Discover network'},
    {id:'w2',at:1000,dur:1200,from:'sta',to:'ap',packet:{id:'wp2',label:'Auth/Assoc',protocol:'802.11',color:'#0a84ff',explanation:'Client authenticates and associates with the AP.'},stepTitle:'Authenticate & associate'},
    {id:'w3',at:2200,dur:1200,from:'ap',to:'sta',packet:{id:'wp3',label:'Connected',protocol:'802.11',color:'#30d158'},stepTitle:'Connection established'},
    {id:'w4',at:3600,dur:1200,from:'sta',to:'ap',packet:{id:'wp4',label:'Data frame',protocol:'Wi‑Fi',color:'#bf5af2',fields:{Protected:'Yes'}},stepTitle:'Send data over Wi‑Fi'},
    {id:'w5',at:4800,dur:1000,from:'ap',to:'wlc',packet:{id:'wp5',label:'Ethernet frame',protocol:'802.3',color:'#bf5af2'},stepTitle:'Bridge to wired network'},
    {id:'w6',at:5800,dur:1000,from:'wlc',to:'srv',packet:{id:'wp6',label:'Request',protocol:'IP/TCP',color:'#ff9f0a'},stepTitle:'Forward to destination'},
  ],
  totalDuration: 7200,
  beginner:['Wi‑Fi clients discover, authenticate, and associate with an access point.','The AP bridges wireless frames to the wired network.','Security (WPA2/WPA3) protects traffic over the air.'],
  advanced:['Roaming, channel contention, RF conditions, and enterprise auth (802.1X) affect performance and security.','This is a simplified flow; management/control/data frame details vary by standard and config.']
}

const securityArch: SimDefinition = {
  id:'segmented-security-arch', title:'Segmented Network Security Architecture', category:'security-arch',
  summary:'Traffic flows through segmented zones with firewall controls.',
  description:'A simplified enterprise security architecture showing user, DMZ, and internal segments separated by firewall inspection.',
  devices:[
    {id:'user',label:'User Zone',kind:'Endpoint',role:'client',x:40,y:210,w:150,h:70,meta:{Segment:'Users'}},
    {id:'fw1',label:'Firewall',kind:'Policy Enforce',role:'defender',x:260,y:210,w:150,h:70,meta:{Control:'Allow/Inspect'}},
    {id:'dmz',label:'DMZ',kind:'Public Services',role:'server',x:500,y:120,w:160,h:70,meta:{Apps:'Web/Proxy'}},
    {id:'fw2',label:'Internal FW',kind:'Segmentation',role:'defender',x:500,y:300,w:160,h:70,meta:{Control:'Restricted'}},
    {id:'app',label:'App Server',kind:'Internal',role:'server',x:760,y:120,w:150,h:70,meta:{Segment:'App'}},
    {id:'db',label:'Database',kind:'Sensitive',role:'server',x:760,y:320,w:150,h:70,meta:{Segment:'Data'}},
  ],
  links:[{id:'l1',from:'user',to:'fw1'},{id:'l2',from:'fw1',to:'dmz'},{id:'l3',from:'fw1',to:'fw2'},{id:'l4',from:'dmz',to:'app',dashed:true},{id:'l5',from:'fw2',to:'db'}],
  events:[
    {id:'sa1',at:0,dur:1100,from:'user',to:'fw1',packet:{id:'sap1',label:'HTTPS request',protocol:'TLS',color:'#0a84ff'},stepTitle:'User initiates access'},
    {id:'sa2',at:1100,dur:1100,from:'fw1',to:'dmz',packet:{id:'sap2',label:'Allowed',protocol:'Policy',color:'#30d158',fields:{Decision:'Permit'}},stepTitle:'Firewall allows to DMZ'},
    {id:'sa3',at:2400,dur:1100,from:'dmz',to:'app',packet:{id:'sap3',label:'App query',protocol:'API',color:'#ff9f0a',explanation:'Front-end in DMZ talks to internal app tier via controlled path.'},stepTitle:'DMZ to app tier'},
    {id:'sa4',at:3700,dur:1100,from:'fw2',to:'db',packet:{id:'sap4',label:'DB access',protocol:'SQL/TLS',color:'#bf5af2',fields:{Restricted:'Yes'}},stepTitle:'Controlled data access'},
    {id:'sa5',at:5000,dur:1200,from:'db',to:'user',packet:{id:'sap5',label:'Response',protocol:'HTTPS',color:'#30d158',explanation:'Response returns through allowed paths (simplified).'},stepTitle:'Response returned'},
  ],
  totalDuration: 6600,
  beginner:['Segmentation separates systems into zones with different trust levels.','Firewalls enforce policies on traffic between zones.','Sensitive systems (like databases) are placed behind tighter controls.'],
  advanced:['Defense-in-depth adds IDS/IPS, WAF, NAC, logging, and least-privilege access.','Architecture varies; this diagram is a simplified teaching model.']
}

const blueTeam: SimDefinition = {
  id:'soc-detection-flow', title:'Blue Team Detection & Response Flow', category:'blue-team',
  summary:'Telemetry becomes alerts, investigation, and response actions.',
  description:'A simplified defensive workflow showing how suspicious activity is detected, analyzed, and contained.',
  devices:[
    {id:'src',label:'Network/Host',kind:'Telemetry Source',role:'other',x:40,y:210,w:160,h:70,meta:{Logs:'DNS/Net/Auth'}},
    {id:'ids',label:'IDS/Firewall',kind:'Detection',role:'defender',x:260,y:120,w:160,h:70,meta:{Signals:'Rules/Anomalies'}},
    {id:'siem',label:'SIEM',kind:'Correlation',role:'defender',x:260,y:300,w:160,h:70,meta:{Events:'Aggregated'}},
    {id:'analyst',label:'SOC Analyst',kind:'Investigation',role:'defender',x:520,y:210,w:170,h:70,meta:{Action:'Triage'}},
    {id:'resp',label:'Response',kind:'Containment',role:'defender',x:760,y:210,w:170,h:70,meta:{Actions:'Block/Isolate'}},
  ],
  links:[{id:'b1',from:'src',to:'ids'},{id:'b2',from:'src',to:'siem'},{id:'b3',from:'ids',to:'analyst'},{id:'b4',from:'siem',to:'analyst'},{id:'b5',from:'analyst',to:'resp'}],
  events:[
    {id:'b1e',at:0,dur:1000,from:'src',to:'ids',packet:{id:'bp1',label:'Suspicious traffic',protocol:'Telemetry',color:'#ff9f0a'},stepTitle:'Generate telemetry',mode:'defense'},
    {id:'b2e',at:200,dur:1100,from:'src',to:'siem',packet:{id:'bp2',label:'Logs',protocol:'Events',color:'#64d2ff'},stepTitle:'Collect and ship logs',mode:'defense'},
    {id:'b3e',at:1200,dur:1100,from:'ids',to:'analyst',packet:{id:'bp3',label:'Alert',protocol:'Detection',color:'#ff453a',fields:{Severity:'High'}},stepTitle:'Raise alert',mode:'defense'},
    {id:'b4e',at:1400,dur:1100,from:'siem',to:'analyst',packet:{id:'bp4',label:'Correlated event',protocol:'SIEM',color:'#bf5af2'},stepTitle:'Correlate evidence',mode:'defense'},
    {id:'b5e',at:2700,dur:1200,from:'analyst',to:'resp',packet:{id:'bp5',label:'Action',protocol:'IR',color:'#30d158',fields:{Contain:'Yes'}},stepTitle:'Contain and remediate',mode:'defense'},
  ],
  totalDuration: 4300,
  beginner:['Defenders collect telemetry, detect suspicious behavior, and investigate alerts.','Response actions can include blocking, isolating hosts, or resetting credentials.','Good visibility and context reduce false positives.'],
  advanced:['Detection engineering maps behaviors to frameworks (e.g., MITRE ATT&CK) and tunes signals.','Workflows vary by tooling and maturity; this is a simplified lifecycle view.']
}

const vapt: SimDefinition = {
  id:'vapt-lifecycle', title:'VAPT Assessment Lifecycle', category:'vapt',
  summary:'Visualize a typical vulnerability assessment and penetration testing workflow.',
  description:'From scoping and discovery to validation, reporting, remediation, and retesting (authorized engagements).',
  devices:[
    {id:'scope',label:'Scope',kind:'Rules & Assets',role:'other',x:40,y:210,w:140,h:65,meta:{Auth:'Required'}},
    {id:'recon',label:'Discovery',kind:'Recon/Enum',role:'other',x:220,y:120,w:150,h:65,meta:{Output:'Assets/Services'}},
    {id:'scan',label:'Identify',kind:'Vuln Analysis',role:'other',x:420,y:120,w:150,h:65,meta:{Output:'Findings'}},
    {id:'val',label:'Validate',kind:'Safe Testing',role:'other',x:620,y:120,w:150,h:65,meta:{Goal:'Confirm impact'}},
    {id:'report',label:'Report',kind:'Risk & Fixes',role:'defender',x:820,y:210,w:150,h:65,meta:{Include:'Evidence'}},
    {id:'fix',label:'Remediate',kind:'Mitigation',role:'defender',x:520,y:320,w:160,h:65,meta:{Owner:'Blue/DevOps'}},
    {id:'retest',label:'Retest',kind:'Verify',role:'defender',x:320,y:320,w:150,h:65,meta:{Goal:'Closure'}},
  ],
  links:[
    {id:'v1',from:'scope',to:'recon'},{id:'v2',from:'recon',to:'scan'},{id:'v3',from:'scan',to:'val'},
    {id:'v4',from:'val',to:'report'},{id:'v5',from:'report',to:'fix'},{id:'v6',from:'fix',to:'retest'},{id:'v7',from:'retest',to:'report',dashed:true}
  ],
  events:[
    {id:'v1e',at:0,dur:900,from:'scope',to:'recon',packet:{id:'vp1',label:'Approved scope',protocol:'Process',color:'#0a84ff'},stepTitle:'Define scope & authorization'},
    {id:'v2e',at:900,dur:900,from:'recon',to:'scan',packet:{id:'vp2',label:'Assets',protocol:'Discovery',color:'#64d2ff'},stepTitle:'Discover and enumerate'},
    {id:'v3e',at:1800,dur:900,from:'scan',to:'val',packet:{id:'vp3',label:'Candidates',protocol:'Analysis',color:'#ff9f0a'},stepTitle:'Identify potential issues'},
    {id:'v4e',at:2700,dur:900,from:'val',to:'report',packet:{id:'vp4',label:'Validated findings',protocol:'Evidence',color:'#bf5af2'},stepTitle:'Validate safely'},
    {id:'v5e',at:3600,dur:900,from:'report',to:'fix',packet:{id:'vp5',label:'Recommendations',protocol:'Report',color:'#30d158'},stepTitle:'Report and prioritize'},
    {id:'v6e',at:4500,dur:900,from:'fix',to:'retest',packet:{id:'vp6',label:'Fixes applied',protocol:'Remediation',color:'#30d158'},stepTitle:'Remediate'},
    {id:'v7e',at:5400,dur:900,from:'retest',to:'report',packet:{id:'vp7',label:'Verification',protocol:'Retest',color:'#0a84ff'},stepTitle:'Retest and close'},
  ],
  totalDuration: 6600,
  beginner:['VAPT is a structured, authorized process to find and help fix security weaknesses.','It includes discovery, analysis, validation, reporting, remediation, and retesting.','Clear scope and permission are essential.'],
  advanced:['Depth and methods vary (black/gray/white box). Findings should include impact, reproducible evidence, and actionable remediation.','This is a high-level lifecycle visualization, not a substitute for engagement-specific methodology.']
}

const cloudNet: SimDefinition = {
  id:'cloud-vpc-flow', title:'Cloud VPC/VNet Traffic Flow', category:'cloud',
  summary:'Visualize traffic through cloud subnets, routing, and security controls.',
  description:'A simplified cloud network path showing public/private subnets, gateways, and security boundaries.',
  devices:[
    {id:'inet',label:'Internet',kind:'External',role:'other',x:40,y:210,w:140,h:70,meta:{Traffic:'Inbound/Outbound'}},
    {id:'igw',label:'Internet Gateway',kind:'Edge',role:'cloud',x:240,y:210,w:160,h:70,meta:{Scope:'Public access'}},
    {id:'pub',label:'Public Subnet',kind:'Load Balancer',role:'cloud',x:460,y:120,w:170,h:70,meta:{Route:'0.0.0.0/0 -> IGW'}},
    {id:'nat',label:'NAT Gateway',kind:'Egress',role:'cloud',x:460,y:300,w:170,h:70,meta:{Use:'Private outbound'}},
    {id:'priv',label:'Private Subnet',kind:'App/DB',role:'cloud',x:700,y:210,w:170,h:80,meta:{'SG/NACL':'Restricted'}},
  ],
  links:[{id:'c1',from:'inet',to:'igw'},{id:'c2',from:'igw',to:'pub'},{id:'c3',from:'pub',to:'priv'},{id:'c4',from:'priv',to:'nat'},{id:'c5',from:'nat',to:'igw',dashed:true}],
  events:[
    {id:'c1e',at:0,dur:1100,from:'inet',to:'igw',packet:{id:'cp1',label:'Inbound',protocol:'HTTPS',color:'#0a84ff'},stepTitle:'Inbound traffic reaches edge'},
    {id:'c2e',at:1100,dur:1100,from:'igw',to:'pub',packet:{id:'cp2',label:'Route to public',protocol:'Cloud routing',color:'#30d158'},stepTitle:'Route to public subnet'},
    {id:'c3e',at:2200,dur:1200,from:'pub',to:'priv',packet:{id:'cp3',label:'App request',protocol:'Internal',color:'#ff9f0a',fields:{SG:'Allowed'}},stepTitle:'Reach private resources'},
    {id:'c4e',at:3600,dur:1100,from:'priv',to:'nat',packet:{id:'cp4',label:'Outbound',protocol:'Egress',color:'#bf5af2'},stepTitle:'Private subnet egress via NAT'},
    {id:'c5e',at:4700,dur:1100,from:'nat',to:'igw',packet:{id:'cp5',label:'To internet',protocol:'NAT',color:'#64d2ff'},stepTitle:'Return path to internet'},
  ],
  totalDuration: 6200,
  beginner:['Cloud networks use virtual networks, subnets, route tables, and gateways.','Public subnets face the internet; private subnets are isolated with controlled egress.','Security groups/NACLs act as virtual firewalls.'],
  advanced:['Design varies across AWS/Azure/GCP (VPC/VNet, peering, TGW, load balancers). Misconfigurations (open rules, public exposure) are common risks.','This is a vendor-neutral simplified diagram.']
}

const enterprise: SimDefinition = {
  id:'enterprise-network-flow', title:'Enterprise Network Architecture Flow', category:'enterprise',
  summary:'End-user traffic through campus/enterprise tiers to applications and internet.',
  description:'A simplified enterprise topology showing access, distribution/core, security, data center, and internet connectivity.',
  devices:[
    {id:'user',label:'User Device',kind:'Access',role:'client',x:40,y:220,w:150,h:70,meta:{Segment:'Campus'}},
    {id:'access',label:'Access Switch',kind:'L2',role:'switch',x:230,y:220,w:150,h:70,meta:{VLAN:'Users'}},
    {id:'core',label:'Core/Distribution',kind:'L3',role:'router',x:430,y:220,w:170,h:70,meta:{Routing:'Internal'}},
    {id:'fw',label:'Firewall',kind:'Perimeter',role:'defender',x:650,y:120,w:150,h:70,meta:{Policy:'Inspect'}},
    {id:'dc',label:'Data Center',kind:'App Services',role:'server',x:650,y:320,w:150,h:70,meta:{Tier:'Apps'}},
    {id:'inet',label:'Internet',kind:'External',role:'other',x:860,y:120,w:140,h:70,meta:{WAN:'ISP'}},
  ],
  links:[{id:'e1',from:'user',to:'access'},{id:'e2',from:'access',to:'core'},{id:'e3',from:'core',to:'fw'},{id:'e4',from:'core',to:'dc'},{id:'e5',from:'fw',to:'inet'}],
  events:[
    {id:'e1e',at:0,dur:1000,from:'user',to:'access',packet:{id:'ep1',label:'Frame',protocol:'Ethernet',color:'#0a84ff'},stepTitle:'User connects at access layer'},
    {id:'e2e',at:1000,dur:1000,from:'access',to:'core',packet:{id:'ep2',label:'Uplink',protocol:'L2/L3',color:'#64d2ff'},stepTitle:'Forward to core/distribution'},
    {id:'e3e',at:2000,dur:1100,from:'core',to:'dc',packet:{id:'ep3',label:'Internal app traffic',protocol:'IP',color:'#30d158'},stepTitle:'Reach internal services'},
    {id:'e4e',at:3300,dur:1100,from:'core',to:'fw',packet:{id:'ep4',label:'Internet-bound',protocol:'IP',color:'#ff9f0a'},stepTitle:'Send external traffic to perimeter'},
    {id:'e5e',at:4400,dur:1100,from:'fw',to:'inet',packet:{id:'ep5',label:'Allowed egress',protocol:'Policy',color:'#bf5af2',fields:{Inspection:'Applied'}},stepTitle:'Egress via firewall/edge'},
  ],
  totalDuration: 5900,
  beginner:['Enterprise networks connect users, internal services, and the internet through layered infrastructure.','Access, core, data center, and perimeter security each serve distinct roles.','Policies control how traffic moves between zones.'],
  advanced:['Real enterprises include redundancy, VLANs/VRFs, SD-WAN, identity, monitoring, and zero-trust controls.','This diagram is a simplified conceptual view of common enterprise flow.']
}


export const categories: { id: SimCategory; title: string; desc: string }[] = [
  { id:'fundamentals', title:'Network Fundamentals', desc:'Core concepts and end-to-end communication.' },
  { id:'osi', title:'OSI Model Visualizer', desc:'Layer-by-layer encapsulation and decapsulation.' },
  { id:'tcpip', title:'TCP/IP and Packet Flow', desc:'Transport behavior and packet journeys.' },
  { id:'protocols', title:'Network Protocol Visualizer', desc:'ARP, DHCP, ICMP and core exchanges.' },
  { id:'dns-internet', title:'DNS and Internet Communication', desc:'Name resolution and web connectivity.' },
  { id:'routing-switching', title:'Routing and Switching', desc:'Forwarding, MAC learning, paths and VLAN concepts.' },
  { id:'subnetting', title:'Subnetting and IP Visualization', desc:'Addressing boundaries and host ranges.' },
  { id:'wireless', title:'Wireless Networking', desc:'Association, roaming and wireless flows.' },
  { id:'security-arch', title:'Network Security Architecture', desc:'Segmentation, firewalls and controls.' },
  { id:'red-team', title:'Red Team Attack Simulations', desc:'Authorized lab attack behavior visualized.' },
  { id:'blue-team', title:'Blue Team Detection Simulations', desc:'Detection, investigation and response views.' },
  { id:'vapt', title:'VAPT Visual Scenarios', desc:'Assessment lifecycle and finding flows.' },
  { id:'cloud', title:'Cloud Networking', desc:'VPC/VNet paths and security boundaries.' },
  { id:'enterprise', title:'Enterprise Network Architecture', desc:'Multi-tier enterprise traffic flows.' },
]

export const simulations: SimDefinition[] = [
  dns, dhcp, arp, tcp, osi, tcpipModel, journey, arpSpoof,
  fundamentals, switching, subnetting, wireless, securityArch, blueTeam, vapt, cloudNet, enterprise,
]

export function simsByCategory(cat: SimCategory){ return simulations.filter(s=>s.category===cat) }