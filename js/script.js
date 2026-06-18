document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. PROJETS DE RAPHAEL PARRÉ AVEC GALERIES PHOTOS --- */
  const projectsData = {
    "sae-reseau-sec": {
      title: "SAE Réseau (SAE 401) — Infrastructure d'Entreprise Sécurisée & Confrontation",
      category: "Réseaux & Sécurité",
      date: "BUT 2 — 2025",
      context: "Conception, déploiement et sécurisation active du réseau d'une entreprise multisites fictive face à des menaces réelles dans le cadre d'un TP de 12 heures et d'un audit de confrontation d'équipe.",
      objectives: "Mettre en œuvre un routeur d'accès, un pare-feu Linux Debian, configurer des serveurs DNS Bind9 (maître/esclave), un serveur de messagerie chiffré, et un tunnel VPN IPsec, tout en appliquant des contre-mesures de sécurité physiques et logiques.",
      tools: ["Debian GNU/Linux", "Cisco IOS", "BIND9 (DNS)", "Postfix & Dovecot", "StrongSwan (IPsec)", "Iptables & Netfilter", "Wireshark", "OpenSSL"],
      part1: "<strong>Déploiement des Services Applicatifs Durcis :</strong><br>• <strong>DNS BIND9 :</strong> Configuration d'un serveur DNS maître et d'un DNS esclave avec transferts de zones sécurisés par clés de transaction TSIG.<br>• <strong>Serveur Web HTTPS :</strong> Serveur Apache2 configuré avec chiffrement fort SSL/TLS (désactivation des suites de chiffrement obsolètes comme SSLv3/TLS1.0) et redirection stricte HTTP vers HTTPS.<br>• <strong>Serveur de Messagerie Sécurisé :</strong> Configuration de Postfix (SMTP) et Dovecot (IMAP) avec authentification chiffrée SASL (via Dovecot) et chiffrement des flux par STARTTLS/SSL.",
      part2: "<strong>Sécurisation Active & Exercice de Confrontation :</strong><br>• <strong>Interconnexion VPN IPsec :</strong> Configuration de tunnels de site à site avec StrongSwan, utilisant des algorithmes de chiffrement robustes (AES-256-GCM, DH groupe 14) pour protéger les flux inter-agences.<br>• <strong>Sécurisation Commutateurs/Routeurs :</strong> Configuration de listes de contrôle d'accès (ACLs) restrictives sur Cisco IOS, activation de DHCP Snooping et Dynamic ARP Inspection (DAI) pour bloquer les attaques par empoisonnement de cache ARP, et configuration de <em>Port-Security</em> pour limiter les adresses MAC autorisées par port.<br>• <strong>Attaque/Défense :</strong> Confrontation en temps réel sous 3 niveaux de privilèges d'administration (SuperAdmin, Admin, Opérateur) face à l'équipe adverse tentant de perturber les services.",
      results: "<strong>Métriques & Validations obtenues :</strong><br>• <strong>Disponibilité VPN :</strong> 100% de taux de disponibilité des tunnels IPsec durant toute la phase de test de charge.<br>• <strong>Sécurité Active :</strong> Blocage automatique et journalisé de 100% des attaques de spoofing ARP et d'usurpation de port grâce à DAI et Port-Security.<br>• <strong>Résilence DNS :</strong> Basculement automatique vers le DNS esclave validé en moins de 1 seconde en simulant la perte du maître.",
      table: "<table class='modal-table'>" +
             "<thead><tr><th>Zone</th><th>VLAN</th><th>Réseau IPv4</th><th>Services associés</th></tr></thead>" +
             "<tbody>" +
             "<tr><td>LAN Agence</td><td>VLAN 10</td><td>192.168.10.0/24</td><td>Postes clients & AD</td></tr>" +
             "<tr><td>DMZ Publique</td><td>VLAN 20</td><td>192.168.20.0/24</td><td>Serveur Web HTTPS, Mail</td></tr>" +
             "<tr><td>Administration</td><td>VLAN 99</td><td>10.0.99.0/24</td><td>Interfaces Switches/Routers</td></tr>" +
             "</tbody></table>",
      configs: `# Configuration d'Iptables - Pare-feu local (Debian)
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
# Autoriser le trafic HTTPS (Web) et DNS
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp --dport 53 -j ACCEPT
iptables -A INPUT -p udp --dport 53 -j ACCEPT
# Autoriser l'IPsec (ISAKMP & ESP)
iptables -A INPUT -p udp --dport 500 -j ACCEPT
iptables -A INPUT -p udp --dport 4500 -j ACCEPT
iptables -P INPUT DROP`,
      conclusion: "Ce projet a été une étape clé pour prouver ma capacité à mener de front la configuration système Unix, le routage/commutation Cisco et les techniques de défense cyber actives dans un contexte opérationnel stressant.",
      gallery: [
        { src: "SAE401/Structure_Reseau_Frain_Parre.png", caption: "Topologie réseau logique globale de l'entreprise sécurisée." },
        { src: "SAE401/images/image1.png", caption: "Configuration de la table de routage et des sous-interfaces sur le routeur d'agence." },
        { src: "SAE401/images/image2.png", caption: "Audit et capture de paquets Wireshark montrant le tunnel IPsec actif." }
      ],
      btnHref: "SAE401/SAE 401/Compte rendu SAE 401.docx",
      btnText: "Télécharger le compte rendu (Word)"
    },
    "sae-cyber-audit": {
      title: "SAE Cybersécurité (SAE 3.Cyber04) — Exploitation OWASP & Audit",
      category: "Sécurité Offensive & Défensive",
      date: "BUT 2 — 2024 - 2025",
      context: "Réalisation d'un audit de vulnérabilités applicatif et de tests d'intrusion sur la plateforme web DVWA (Damn Vulnerable Web Application) afin de comprendre les techniques de piratage courantes et concevoir des contre-mesures adaptées.",
      objectives: "Identifier et exploiter de façon méthodique les failles majeures du Top 10 OWASP, rédiger des fiches d'audit professionnelles (opérations menées, criticité) et formuler des correctifs et mesures compensatoires pour chaque vulnérabilité.",
      tools: ["Kali Linux", "Hydra", "Nmap", "Wireshark", "Burp Suite", "SQLmap", "Nikto & Dirb", "PHP / MySQL (Code correctif)"],
      part1: "<strong>Exploitation de Vulnérabilités Web (Audit Offensif) :</strong><br>• <strong>Reconnaissance :</strong> Scan Nmap ciblé, énumération de sous-répertoires via Dirb et scan de vulnérabilités web avec Nikto.<br>• <strong>Injections :</strong> Exploitation d'injections SQL pour extraire des tables utilisateurs (noms, mots de passe hashés) et injections de commandes OS pour obtenir un shell distant.<br>• <strong>Authentification & Fichiers :</strong> Brute force de formulaires d'authentification à l'aide de Hydra et dictionnaires ciblés, exploitation de failles d'inclusion de fichiers locaux/distants (LFI/RFI) et téléversement non sécurisé (File Upload) d'un script malveillant PHP.",
      part2: "<strong>Rédaction des Rapports d'Audit & Remédiations :</strong><br>• <strong>Fiches Techniques :</strong> Rédaction pour chaque faille exploitée d'une fiche d'audit comportant le descriptif de l'attaque, le score de gravité CVSSv3 et l'impact sur la confidentialité, intégrité et disponibilité.<br>• <strong>Remédiation (Développement Sécurisé) :</strong> Programmation de correctifs de code PHP. Pour les injections SQL, remplacement des requêtes dynamiques par des requêtes préparées avec liaisons de paramètres (PDO bindParam). Pour le File Upload, contrôle strict des extensions (whitelist) et renommage systématique des fichiers sur le serveur.",
      results: "<strong>Rapport d'audit et remédiations validés :</strong><br>• <strong>Exploitation :</strong> 100% des vulnérabilités DVWA ciblées exploitées avec succès aux niveaux Low et Medium.<br>• <strong>Résolution :</strong> 100% des vulnérabilités résolues au niveau maximal (High/Impossible) après application de nos correctifs de code source PHP.",
      table: "<table class='modal-table'>" +
             "<thead><tr><th>Vulnérabilité</th><th>Criticité (CVSS)</th><th>Impact</th><th>Solution appliquée</th></tr></thead>" +
             "<tbody>" +
             "<tr><td>Injection SQL</td><td>Élevée (8.5)</td><td>Fuite de données / AD</td><td>Requêtes préparées PDO</td></tr>" +
             "<tr><td>Command Injection</td><td>Critique (9.8)</td><td>Contrôle du serveur</td><td>Validation entrées regex / escapeshellarg</td></tr>" +
             "<tr><td>File Upload</td><td>Élevée (8.1)</td><td>Exécution de webshell</td><td>Vérification MIME, renommage & dossier non-exécutable</td></tr>" +
             "</tbody></table>",
      configs: `// Code PHP Correctif - Injection SQL (DVWA High Level Correction)
$id = $_GET['id'];
// Remplacement par une requête préparée PDO pour contrer les injections SQL
$query = "SELECT first_name, last_name FROM users WHERE user_id = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $id, PDO::PARAM_INT);
$stmt->execute();
$results = $stmt->fetchAll();`,
      conclusion: "Ce projet m'a permis d'acquérir une double compétence précieuse : celle du pentesteur capable de trouver les failles, et celle du développeur capable d'implémenter des correctifs robustes au niveau applicatif.",
      gallery: [
        { src: "SAE3Cyber04/SAE3.Cyber04_Parre_Frain.pdf", caption: "Rapport complet de Pentesting et d'audit DVWA (PDF)." },
        { src: "SAE3Cyber04/Liste_outils_pentesting_Frain_Parre.pdf", caption: "Catalogue des outils de test d'intrusion (PDF)." }
      ],
      btnHref: "SAE3Cyber04/SAE3.Cyber04_Parre_Frain.pdf",
      btnText: "Consulter le rapport d'audit (PDF)"
    },
    "sae-cisco-pt": {
      title: "SAÉ 2.01 : Architecture Réseau & Services",
      category: "Simulation Cisco",
      date: "BUT 1 — 2024",
      context: "Conception complète de l'architecture réseau informatique de l'entreprise fictive ORA dans le cadre de la SAÉ 2.01. Ce projet intègre plusieurs zones fonctionnelles (Bureaux, Salle des serveurs, DMZ) interconnectées avec le réseau d'un FAI (Orange) pour assurer la communication interne et un accès Internet sécurisé.",
      objectives: "Mettre en œuvre un réseau structuré, sécurisé et redondant : plan d'adressage IPv4 optimisé en VLSM et double pile IPv6, segmentation logique par VLANs, services d'infrastructure (DHCP, DNS local et public, serveurs Web intranet et public), interconnexion via routage dynamique OSPFv2/OSPFv3, translation d'adresses (NAT/PAT) et sécurisation des accès (SSH, ACLs, Pare-feu).",
      tools: ["Cisco Packet Tracer", "Cisco IOS CLI", "Calculateur VLSM", "Routage IPv4 / IPv6", "Services Réseau (DNS, DHCP, HTTP)", "Sécurisation (SSH, ACLs)"],
      part1: "<strong>Configuration Réseau de l'Entreprise ORA :</strong><br>• <strong>Zone Bureaux (LAN 1) :</strong> Structurée en sous-réseaux à l'aide d'un plan d'adressage VLSM (Bureau Développeurs/Marketing) et segmentée par VLANs (VLAN 10: Administration et Direction, VLAN 20: Employés) sur les commutateurs Cisco.<br>• <strong>Zone LAN 2 :</strong> Déploiement d'une Salle de réunion avec distribution dynamique des configurations IP via le protocole DHCP (serveur configuré sur le commutateur de distribution SWD), et d'une Salle des serveurs hébergeant le site intranet de l'entreprise (intranet.ora.fr).<br>• <strong>Zone DMZ :</strong> Zone isolée accueillant le serveur Web public accessible depuis le réseau FAI de l'opérateur Orange.",
      part2: "<strong>Routage OSPF, Services & Sécurisation :</strong><br>• <strong>Routage Dynamique (OSPFv2 & OSPFv3) :</strong> Interconnexion dynamique double pile IPv4/IPv6 entre le routeur d'entreprise RPE et le routeur de l'agence secondaire RSE, assurant la convergence automatique des tables de routage.<br>• <strong>Translation d'adresses (NAT/PAT) :</strong> Implémentation du NAT Dynamique (Overload) sur le routeur RPE pour permettre aux postes internes d'accéder au FAI sous une adresse IP publique unique, et redirection de port (PAT) pour rendre le serveur Web DMZ accessible de l'extérieur.<br>• <strong>Sécurisation des Équipements :</strong> Configuration d'accès distants sécurisés via SSH sur les terminaux VTY du routeur RPE et des commutateurs, et implémentation d'ACL (listes de contrôle d'accès) faisant office de pare-feu pour bloquer les accès non autorisés d'utilisateurs externes vers les zones sensibles.",
      results: "<strong>Résultats de la simulation & Validations :</strong><br>• <strong>Routage Dynamique :</strong> Convergence réussie des tables de routage OSPFv2 et OSPFv3 entre RPE et RSE, permettant une communication complète entre tous les réseaux d'agence.<br>• <strong>Résolution de Noms (DNS) :</strong> Accès fonctionnel aux serveurs Web via URL (intranet.ora.fr en interne et www.ora.fr depuis l'extérieur) grâce à la délégation et la redirection entre le serveur DNS de la DMZ et celui du FAI.<br>• <strong>Sécurisation & Traduction :</strong> Validation de la traduction d'adresses NAT Overload pour les pings des PC internes vers le FAI, et redirection fonctionnelle du port 80 vers le serveur Web de la DMZ.<br>• <strong>Filtrage :</strong> Blocage ciblé et validé des flux ICMP/IP non autorisés depuis le réseau externe du FAI vers les ressources internes grâce aux règles de pare-feu ACL étendues.",
      table: "<table class='modal-table'>" +
             "<thead><tr><th>Zone / Bureau</th><th>VLAN</th><th>Réseau IPv4</th><th>Adresse IPv6</th></tr></thead>" +
             "<tbody>" +
             "<tr><td>Développeurs / Marketing</td><td>-</td><td>192.168.1.0/26</td><td>2001:db8:1::/64</td></tr>" +
             "<tr><td>Administration / Direction</td><td>VLAN 10</td><td>192.168.1.64/26</td><td>2001:db8:10::/64</td></tr>" +
             "<tr><td>Salle de réunion (DHCP)</td><td>-</td><td>192.168.2.0/28</td><td>2001:db8:2::/64</td></tr>" +
             "<tr><td>Salle des serveurs (Intranet)</td><td>-</td><td>192.168.3.0/29</td><td>2001:db8:3::/64</td></tr>" +
             "<tr><td>DMZ (Serveur Web Public)</td><td>-</td><td>172.16.0.0/29</td><td>2001:db8:dmz::/64</td></tr>" +
             "</tbody></table>",
      configs: [
        {
          name: "Routeur RPE (OSPF, NAT, PAT & ACL Pare-feu)",
          code: `! Configuration du Routage Dynamique OSPFv2 (IPv4) sur Routeur RPE
router ospf 1
 router-id 1.1.1.1
 network 192.168.2.0 0.0.0.15 area 0
 network 192.168.3.0 0.0.0.7 area 0
 network 172.16.0.0 0.0.0.7 area 0
 network 100.100.100.0 0.0.0.3 area 0
 network 192.168.10.0 0.0.0.3 area 0
!
! Configuration de la Translation d'adresses NAT et Port Forwarding (PAT)
interface Gig0/0
 ip nat inside
interface Gig0/1
 ip nat inside
interface Gig0/3/0
 ip nat inside
interface Se0/0/0
 ip nat outside
!
access-list 1 permit 192.168.0.0 0.0.255.255
ip nat inside source list 1 interface Se0/0/0 overload
ip nat inside source static tcp 172.16.0.2 80 100.100.100.1 80
!
! Configuration IPv6 et Routage OSPFv3
ipv6 unicast-routing
interface Gig0/0
 ipv6 address 2001:db8:3::1/64
 ipv6 ospf 1 area 0
!
! Configuration Pare-feu par ACL Etendue
access-list 101 deny ip 100.100.100.0 0.0.0.255 172.16.0.0 0.0.0.7
access-list 101 permit tcp any host 172.16.0.2 eq 80
interface Se0/0/0
 ip access-group 101 in`
        },
        {
          name: "Switch SWD (VLANs, Trunks & SSH)",
          code: `! Configuration des VLANs sur le Switch de Distribution SWD
vlan 10
 name Administration
vlan 20
 name Employes
vlan 30
 name Invite
!
! Configuration des interfaces Trunk
interface range Gig0/1 - 2
 switchport trunk encapsulation dot1q
 switchport mode trunk
!
! Configuration de la sécurisation SSH sur le Switch SWD
ip domain-name ora.local
crypto key generate rsa
 1024
!
username admin privilege 15 secret admin123
line vty 0 4
 login local
 transport input ssh`
        },
        {
          name: "Serveur DNS de la DMZ (Fichier de zone)",
          code: `; Configuration de la zone locale "ora.fr" pour l'entreprise
$TTL 86400
@   IN  SOA  dns.ora.fr. admin.ora.fr. (
             2024061701 ; Serial
             3600       ; Refresh
             1800       ; Retry
             604800     ; Expire
             86400 )    ; Minimum TTL
;
@   IN  NS   dns.ora.fr.
dns IN  A    172.16.0.3
www IN  A    172.16.0.2
intranet IN A 192.168.3.3`
        }
      ],
      conclusion: "Cette SAÉ 2.01 m'a permis de consolider l'ensemble des connaissances acquises en semestre 1 et 2 en architecture réseau, commutation et routage. La configuration sur Cisco Packet Tracer m'a confronté aux problématiques réelles de l'administrateur système et réseau : élaboration rigoureuse d'un plan d'adressage VLSM, mise en place de haute disponibilité par VLANs et DHCP, routage dynamique double-pile (IPv4/IPv6), translation d'adresse (NAT/PAT) et règles de filtrage par pare-feu. C'est un projet fondamental qui valide ma capacité à concevoir et déployer une infrastructure d'entreprise fonctionnelle et sécurisée.",
      gallery: [
        { src: "SAE201/images/img_entreprise_photo.png", caption: "Topologie réseau complète sous Cisco Packet Tracer (salle des serveurs, FAI et agences)." },
        { src: "SAE201/images/VLANs.png", caption: "Diagramme de découpage et de routage des VLANs logiques configurés sur le switch principal." },
        { src: "SAE201/images/dns_records.png", caption: "Table des enregistrements DNS (A Record, NS, SOA) configurés sur le serveur de nom." },
        { src: "SAE201/images/adr_ipv6.png", caption: "Table d'adressage IPv6 de l'entreprise avec désignation des sous-réseaux et méthodes d'affectation." },
        { src: "SAE201/images/adr_ipv4.png", caption: "Table d'adressage IPv4 et répartition des sous-réseaux calculés par la méthode VLSM." },
        { src: "SAE201/images/acc_org.png", caption: "Diagramme de flux d'accès organisationnel et plan de routage d'interconnexion." }
      ],
      btnHref: "SAE201/SAE201_Parre_Raphael.pkt",
      btnText: "Télécharger le fichier .pkt"
    },
    "sae-telecom-radio": {
      title: "SAE Télécom (SAE 301) — Modélisation Radio & Antennes",
      category: "Télécommunications",
      date: "Semestre 3 — 2025",
      context: "Étude théorique et expérimentale d'un système de transmission radio analogique AM/FM et d'antennes directives dans le cadre de la SAÉ 301. Ce projet allie des mesures réelles sur analyseur de spectre (Skyrock 95.4 MHz) à des modélisations électromagnétiques d'antennes sous MMANA-GAL basic.",
      objectives: "Comprendre les concepts physiques de propagation des ondes (ligne de vue, diffraction), analyser la puissance des signaux radio captés, étudier les modulations AM/FM (immunité au bruit, directivité), concevoir et simuler des diagrammes de rayonnement d'antennes directives (Yagi, dipôle), et calculer un bilan de liaison radio pour évaluer la puissance d'émission Pe.",
      tools: ["MMANA-GAL Basic", "Analyseur de Spectre", "Récepteur / Démodulateur Radio", "Antennes Yagi & Brin (Dipôle)", "Bilan de liaison théorique"],
      part1: "<strong>Mesures Expérimentales & Analyse Spectrale :</strong><br>• <strong>Chaîne de transmission :</strong> Schématisation structurelle des différents modules de transmission radio étudiés.<br><img src='SAE301 Systeme de communication radio/cha_trans.png' style='width: 100%; border-radius: 6px; margin: 0.5rem 0 1rem 0; border: 1px solid rgba(255,255,255,0.1);' class='zoomable-img' alt='Chaîne de transmission'><br>• <strong>Environnement de test :</strong> Captation FM réelle en laboratoire via antenne filaire, analyseur de spectre et récepteur radio pour démoduler l'audio.<br>• <strong>Analyse Skyrock (95.4 MHz) :</strong> Mesure d'une puissance reçue de <strong>-53.29 dBm</strong> sur l'analyseur de spectre.",
      part2: "<strong>Conception d'Antennes & Simulation MMANA-GAL :</strong><br>• <strong>Simulation Antenne Brin (Monopole) :</strong> Dimensionnement physique d'un dipôle demi-onde (environ 1.57 m). Rayonnement large (omni) et gain modéré de 2.16 dBi.<br>• <strong>Simulation Antenne Yagi-Uda :</strong> Modélisation et tracé directif (gain de 5.62 dBi, angle étroit de 48°), réduisant les interférences arrière.<br><img src='SAE301 Systeme de communication radio/trans_radio.png' style='width: 100%; border-radius: 6px; margin: 1rem 0 0 0; border: 1px solid rgba(255,255,255,0.1);' class='zoomable-img' alt='Montage expérimental radio'>",
      results: "<div style='background: rgba(14, 165, 233, 0.08); border-left: 4px solid var(--accent); padding: 1.25rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; box-sizing: border-box;'><h4 style='margin: 0 0 0.5rem 0; color: var(--accent); font-weight: 700; font-size: 0.95rem; text-transform: uppercase;'><i class='fas fa-calculator'></i> Bilan de Liaison Crucial</h4>• <strong>Atténuation en espace libre (Perte de parcours) :</strong> Calculée pour une distance d'émetteur urbain de d = 650 m à la fréquence de 96.4 MHz :<br>&nbsp;&nbsp; α = 20 log10(4πd / λ) ≈ 68.38 dB<br>• <strong>Puissance d'émission (Pe) :</strong> Déduite par le bilan de liaison : Pe = Pr - Ge + α - Gr. Avec Pr = -18.28 dBm, Ge = 3 dBi et Gr = 2.6 dBi, on obtient Pe = 44.50 dBm (soit 28.18 Watts).</div><strong>Comparaison de directivité et d'adaptation de l'antenne Yagi :</strong><br>L'antenne Yagi est directive et concentre l'énergie (gain de 5.62 dBi). En cas de fréquence non adaptée (ex. 162 kHz), l'antenne perd sa directivité et son gain chute à -23 dBi.<br><div style='display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem;'><div style='text-align: center;'><img src='SAE301 Systeme de communication radio/diag_adapt.png' style='width: 100%; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);' class='zoomable-img' alt='Diagramme adapté'><span style='font-size:0.75rem; color:var(--text-muted); display:block; margin-top:0.25rem;'>Adapté (95.4 MHz)</span></div><div style='text-align: center;'><img src='SAE301 Systeme de communication radio/diag_non_adapt.png' style='width: 100%; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);' class='zoomable-img' alt='Diagramme non adapté'><span style='font-size:0.75rem; color:var(--text-muted); display:block; margin-top:0.25rem;'>Non adapté (162 kHz)</span></div></div>",
      table: "<table class='modal-table'>" +
             "<thead><tr><th>Type d'antenne</th><th>Fréquence cible</th><th>Taille théorique</th><th>Gain max</th><th>Angle</th><th>Directivité</th></tr></thead>" +
             "<tbody>" +
             "<tr><td>Brin (dipôle)</td><td>95.4 MHz (FM)</td><td>1.57 m</td><td>2.16 dBi</td><td>~78°</td><td>Omnidirectionnelle</td></tr>" +
             "<tr><td>Brin (dipôle)</td><td>162 kHz (AM)</td><td>~925 m</td><td>2.15 dBi</td><td>Très large</td><td>Nulle (inexploitable)</td></tr>" +
             "<tr><td>Yagi-Uda</td><td>95.4 MHz (FM)</td><td>1.57 m (par brin)</td><td>5.62 dBi</td><td>~48°</td><td>Directive (face avant)</td></tr>" +
             "<tr><td>Yagi-Uda</td><td>162 kHz (AM)</td><td>Irralisable</td><td>Très faible</td><td>-</td><td>Nulle</td></tr>" +
             "</tbody></table>",
      configs: null,
      conclusion: "Cette SAÉ 301 a mis en évidence le lien indissociable entre la théorie ondulatoire et la pratique radio. Nous avons pu concevoir des antennes virtuelles performantes avec MMANA-GAL, analyser des signaux FM en conditions réelles et calculer un bilan de liaison complet. Ces notions de directivité, de gain et d'atténuation sont cruciales pour dimensionner tout système de communication sans fil moderne.",
      gallery: [
        { src: "SAE301 Systeme de communication radio/ant_yagi.png", caption: "Photo de l'antenne Yagi-Uda physique installée pour les tests expérimentaux." },
        { src: "SAE301 Systeme de communication radio/cha_trans.png", caption: "Schéma structurel de la chaîne de transmission radio (Émetteur, Ligne, Antennes, Récepteur)." },
        { src: "SAE301 Systeme de communication radio/diag_adapt.png", caption: "Diagramme de rayonnement MMANA-GAL adapté à 95.4 MHz (FM)." },
        { src: "SAE301 Systeme de communication radio/diag_non_adapt.png", caption: "Diagramme de rayonnement MMANA-GAL non adapté à 162 kHz (AM)." },
        { src: "SAE301 Systeme de communication radio/trans_radio.png", caption: "Photo du montage expérimental de transmission radio de laboratoire." },
        { src: "SAE301 Systeme de communication radio/Systeme_de_communication_radio-SAE301-Favre_Parre_Le (1).pdf", caption: "Rapport complet d'études Télécoms et radiocommunications (PDF)." }
      ],
      btnHref: "SAE301 Systeme de communication radio/Systeme_de_communication_radio-SAE301-Favre_Parre_Le (1).pdf",
      btnText: "Télécharger le rapport Télécom (PDF)"
    }
  };

  /* --- 1.2 DÉTAILS TECHNIQUES DES LOGICIELS --- */
  const softwareData = {
    "kali-linux": {
      title: "Kali Linux",
      category: "Cybersécurité",
      role: "Audit offensif & Pentesting",
      purpose: "Système d'exploitation dédié à la sécurité de l'information et aux tests de pénétration.",
      description: "Kali Linux est la distribution standard de l'industrie pour les audits de sécurité. Elle regroupe des centaines d'outils spécialisés dans la recherche de vulnérabilités, l'analyse réseau, l'exploitation de failles et le reverse engineering.",
      usage: "Utilisé lors de la SAÉ 3.Cyber04 pour cartographier le réseau (Nmap), intercepter les flux (Wireshark), tester la robustesse des mots de passe (Hydra) et analyser la sécurité applicative.",
      icon: "devicon-kali-plain"
    },
    "nmap": {
      title: "Nmap Scanner",
      category: "Cybersécurité",
      role: "Scanner de ports & Reconnaissance",
      purpose: "Découverte d'hôtes actifs, de ports ouverts et détection de services ou de systèmes d'exploitation.",
      description: "Nmap (Network Mapper) est le scanner de sécurité réseau de référence. Il permet d'effectuer un inventaire réseau précis, d'identifier les ports ouverts et de détecter les vulnérabilités potentielles via son moteur de scripts NSE (Nmap Scripting Engine).",
      usage: "Exploité au début de l'audit de la SAÉ 3.Cyber04 pour scanner la cible DVWA et repérer les services actifs (HTTP, SSH).",
      icon: "fas fa-binoculars"
    },
    "metasploit": {
      title: "Metasploit Framework",
      category: "Cybersécurité",
      role: "Tests d'intrusion & Exploitation",
      purpose: "Recherche de vulnérabilités, développement d'exploits et exécution de charges utiles.",
      description: "Metasploit est une plateforme de test d'intrusion de classe mondiale. Il permet aux professionnels de la sécurité de tester les vulnérabilités de systèmes informatiques en simulant des cyberattaques de manière contrôlée.",
      usage: "Étudié et manipulé en laboratoire pour comprendre les mécanismes d'exploitation de vulnérabilités logicielles communes.",
      icon: "fas fa-skull-crossbones"
    },
    "burpsuite": {
      title: "Burp Suite",
      category: "Cybersécurité",
      role: "Proxy d'interception Web",
      purpose: "Analyse et audit de sécurité des applications Web en interceptant le trafic HTTP/HTTPS.",
      description: "Burp Suite est la boîte à outils leader pour l'audit d'applications Web. Il agit comme un proxy intermédiaire, permettant d'intercepter les paquets, de modifier des requêtes à la volée (Burp Repeater), et d'automatiser des tests d'injection.",
      usage: "Utilisé dans la SAÉ 3.Cyber04 pour intercepter les requêtes d'authentification DVWA et forcer les variables de session.",
      icon: "fas fa-user-secret"
    },
    "hydra": {
      title: "THC Hydra",
      category: "Cybersécurité",
      role: "Casseur d'authentification réseau",
      purpose: "Brute-force parallélisé de mots de passe sur divers protocoles applicatifs.",
      description: "Hydra est un casseur de connexion réseau ultra-rapide capable de mener des attaques par dictionnaire ou par force brute sur plus de 50 protocoles, dont SSH, FTP, HTTP (GET/POST Form), SMB et VNC.",
      usage: "Utilisé lors de la SAÉ 3.Cyber04 pour mener des attaques de force brute rapides par dictionnaire de mots de passe sur la page de connexion.",
      icon: "fas fa-unlock-keyhole"
    },
    "gobuster": {
      title: "Gobuster",
      category: "Cybersécurité",
      role: "Brute-force d'URLs & DNS",
      purpose: "Découverte de répertoires cachés, de fichiers et de sous-domaines sur des serveurs web.",
      description: "Gobuster est un outil écrit en Go très performant, utilisé pour découvrir les fichiers et répertoires masqués sur un serveur web en testant une liste de mots (wordlist), ainsi que pour énumérer des sous-domaines.",
      usage: "Déployé dans la SAÉ 3.Cyber04 pour cartographier l'arborescence invisible de la plateforme web dvwa.",
      icon: "fas fa-search-plus"
    },
    "wireshark": {
      title: "Wireshark Packet Analyzer",
      category: "Cybersécurité",
      role: "Analyse protocolaire & diagnostic forensic",
      purpose: "Capture en temps réel et inspection approfondie de trames réseaux.",
      description: "Wireshark est l'outil indispensable pour localiser précisément l'origine de pannes réseau complexes (perte de paquets, lenteurs protocolaires) ou pour identifier des comportements malveillants ou suspects (ex. balayages de ports Nmap, requêtes brutes de brute force ou tentatives d'injection SQL).",
      usage: "Application de filtres complexes de paquets (ip.addr, tcp.flags), suivi de flux TCP/HTTP (Follow TCP Stream), et exportation de dumps réseau.",
      icon: "fas fa-chart-line"
    },
    "linux": {
      title: "Linux Debian",
      category: "Réseaux & Systèmes",
      role: "Administration Système",
      purpose: "Administration système robuste et hébergement de services d'infrastructure.",
      description: "Debian est mon système de prédilece pour l'administration et l'hébergement de serveurs de production fiables et hautement disponibles (DNS BIND9, serveurs Apache/Nginx, serveurs de messagerie sécurisés Postfix/Dovecot).",
      usage: "Écriture de scripts shell (Bash), gestion fine des privilèges système (Sudoers, ACLs), et configuration sécurisée des services réseaux.",
      icon: "devicon-linux-plain"
    },
    "windows": {
      title: "Windows Server & AD DS",
      category: "Réseaux & Systèmes",
      role: "Gestion d'infrastructures d'annuaire",
      purpose: "Déploiement et administration centralisée d'Active Directory Domain Services (AD DS).",
      description: "Indispensable pour structurer la gestion logique d'une entreprise. Permet de centraliser les comptes d'utilisateurs, le contrôle d'accès aux ressources partagées de fichiers et de configurer des stratégies de sécurité cohérentes à l'échelle d'un parc informatique.",
      usage: "Création de domaines, liaisons de stratégies de groupe (GPOs) restrictives, gestion de serveurs de fichiers NTFS sécurisés et configuration de services DHCP/DNS Windows.",
      icon: "devicon-windows8-original"
    },
    "virtualbox": {
      title: "VirtualBox",
      category: "Réseaux & Systèmes",
      role: "Virtualisation & Hyperviseur",
      purpose: "Création et hébergement de machines virtuelles pour des environnements de test isolés.",
      description: "VirtualBox est un hyperviseur de type 2 open-source qui permet de faire tourner plusieurs systèmes d'exploitation (Linux, Windows Server) sur la même machine physique, facilitant le maquettage d'architectures réseaux sans matériel physique dédié.",
      usage: "Utilisé pour héberger et tester l'architecture de serveurs virtuels Debian et les machines d'audit lors des SAÉ 401 et 3.Cyber04.",
      icon: "fas fa-cubes"
    },
    "cisco": {
      title: "Cisco IOS (Command Line)",
      category: "Réseaux & Systèmes",
      role: "Configuration de commutateurs & routeurs",
      purpose: "Configuration CLI avancée et routage de flux inter-sites.",
      description: "Utilisé pour la programmation en ligne de commande de commutateurs (Switches) et routeurs de marque Cisco. Permet de structurer le réseau physique en VLANs logiques et d'automatiser le basculement dynamique des routes logiques en cas de coupure de lien.",
      usage: "Configuration d'agrégations de liens (EtherChannel), routage inter-VLAN, protocole Spanning Tree (STP), routage dynamique (OSPF / OSPFv3) et listes de contrôle d'accès (ACLs) WAN.",
      icon: "fas fa-route"
    },
    "cisco-pt": {
      title: "Cisco Packet Tracer",
      category: "Réseaux & Systèmes",
      role: "Simulation de topologies réseaux",
      purpose: "Conception, configuration et simulation visuelle d'infrastructures réseaux complexes.",
      description: "Cisco Packet Tracer est un outil de simulation puissant qui permet d'expérimenter le comportement des réseaux. Il permet de connecter virtuellement des commutateurs, des routeurs, des points d'accès et des serveurs pour tester des protocoles de routage, de filtrage et d'adressage sans matériel physique.",
      usage: "Utilisé dans la SAÉ 2.01 pour simuler toute l'infrastructure d'une entreprise multisites, incluant la configuration dynamique de VLANs, de routage OSPFv2/OSPFv3 et d'ACLs.",
      icon: "fas fa-network-wired"
    },
    "docker": {
      title: "Docker (Conteneurisation)",
      category: "Réseaux & Systèmes",
      role: "Provisionnement de services conteneurisés",
      purpose: "Création d'environnements d'exécution légers, isolés et reproductibles.",
      description: "Utilisé pour encapsuler des applications et services applicatifs (serveurs web, bases de données ou conteneurs d'outils d'audit cyber) au sein de conteneurs isolés. Cela évite les conflits de dépendances système et accélère grandement le déploiement.",
      usage: "Écriture de fichiers de configuration Dockerfile, gestion de volumes persistants et déploiement de réseaux internes virtuels Docker.",
      icon: "devicon-docker-plain"
    },
    "mysql": {
      title: "MySQL / MariaDB",
      category: "Réseaux & Systèmes",
      role: "Gestion de bases de données relationnelles",
      purpose: "Stockage, structuration et requêtage sécurisé des données applicatives.",
      description: "MySQL est l'un des systèmes de gestion de bases de données les plus populaires au monde. Comprendre son fonctionnement est crucial tant pour le développement d'applications que pour l'évaluation de leur sécurité (comme la prévention d'injections SQL).",
      usage: "Manipulé dans le cadre du développement de serveurs web et analysé pour la remédiation de failles d'injection SQL dans la SAÉ 3.Cyber04 (utilisation de requêtes préparées PDO).",
      icon: "devicon-mysql-plain"
    },
    "git": {
      title: "Git (Version Control)",
      category: "Réseaux & Systèmes",
      role: "Gestion de versions de projets & scripts",
      purpose: "Suivi des modifications de code et collaboration technique sécurisée.",
      description: "Essentiel pour maintenir un historique propre des modifications apportées aux scripts d'administration système ou aux fichiers de configurations réseaux, et pour collaborer efficacement à plusieurs sur des maquettes de déploiement.",
      usage: "Commandes de base (git init, add, commit, push, pull, clone) et résolution de conflits de fusion logologique.",
      icon: "devicon-git-plain"
    },
    "bash": {
      title: "Bash Scripting (Shell Unix)",
      category: "Réseaux & Systèmes",
      role: "Automatisation système & tâches Cron",
      purpose: "Optimisation de l'administration et de l'exploitation de serveurs Unix.",
      description: "Écriture de scripts exécutables directement par l'interpréteur de commandes Linux. Essentiel pour automatiser la configuration de serveurs au démarrage, programmer des tâches répétitives de sauvegarde (via Cron), ou surveiller la santé des ressources système.",
      usage: "Scripting de déploiement automatique de paquets Apache/Bind9 et création de scripts de supervision de charges processeur/RAM.",
      icon: "devicon-bash-plain"
    },
    "vscode": {
      title: "Visual Studio Code",
      category: "Code & Développement",
      role: "Éditeur de code extensible",
      purpose: "Édition de code source, scripts système et fichiers de configuration.",
      description: "VS Code est mon outil privilégié pour l'écriture de scripts (Bash, Python) et le développement web. Son extensibilité et sa console intégrée permettent un workflow de programmation et d'administration fluide.",
      usage: "Utilisé pour la création de scripts d'administration système et le développement des maquettes de services applicatifs.",
      icon: "devicon-vscode-plain"
    },
    "eclipse": {
      title: "Eclipse IDE",
      category: "Code & Développement",
      role: "Environnement de Développement Intégré",
      purpose: "Développement logiciel robuste, notamment en langage Java.",
      description: "Eclipse est un IDE classique et complet utilisé pour le développement d'applications logicielles d'envergure, avec une gestion fine du débogage, des dépendances de compilation et du suivi de projet.",
      usage: "Utilisé lors de TP académiques et projets de développement logiciel durant mon cursus BUT.",
      icon: "devicon-eclipse-plain"
    },
    "python": {
      title: "Python 3 Scripting",
      category: "Code & Développement",
      role: "Automatisation de scripts & analyses",
      purpose: "Création de scripts utilitaires pour l'administration, le traitement de données et l'analyse.",
      description: "Python est le langage idéal pour automatiser le traitement de données, écrire des scripts d'administration ou programmer de petits outils d'analyse de paquets et de calculs de signaux.",
      usage: "Utilisé pour concevoir des scripts de parsing de fichiers logs et des scripts d'interrogations réseaux.",
      icon: "devicon-python-plain"
    },
    "mmana-gal": {
      title: "MMANA-GAL Basic",
      category: "Télécommunications",
      role: "Simulation Électromagnétique d'Antennes",
      purpose: "Modélisation d'antennes et tracé de leurs diagrammes de rayonnement.",
      description: "MMANA-GAL est un logiciel d'analyse d'antennes basé sur la méthode des moments (MININEC). Il permet d'étudier le gain, l'impédance, le rapport avant/arrière et le diagramme de rayonnement 2D/3D d'une antenne en fonction de sa géométrie et de la fréquence.",
      usage: "Utilisé lors de la SAÉ 3.01 pour simuler et comparer les comportements d'adaptation et de directivité d'antennes dipôles et d'antennes directives Yagi-Uda.",
      icon: "fas fa-satellite-dish"
    },
    "octave": {
      title: "GNU Octave",
      category: "Télécommunications",
      role: "Calcul numérique & Simulation",
      purpose: "Traitement de données mathématiques et analyse spectrale numérique.",
      description: "GNU Octave est un langage de programmation de haut niveau principalement destiné aux calculs numériques. Très similaire à MATLAB, il est idéal pour le traitement de signaux, les calculs de matrices et les simulations physiques.",
      usage: "Exploité pour modéliser des filtres de transmission, simuler des modulations analogiques et tracer des courbes théoriques de propagation.",
      icon: "fas fa-wave-square"
    },
    "labview": {
      title: "LabVIEW",
      category: "Télécommunications",
      role: "Conception de systèmes d'instrumentation",
      purpose: "Développement graphique pour le contrôle d'instruments de mesure et l'acquisition de signaux.",
      description: "LabVIEW est un environnement de développement graphique conçu par National Instruments. Il permet d'interagir facilement avec des appareils de mesure physiques, de traiter les signaux en temps réel et de concevoir des interfaces d'instrumentation complexes.",
      usage: "Utilisé lors de TP pour concevoir des chaînes de réception et d'acquisition de données sur des bancs de tests radio.",
      icon: "fas fa-sliders"
    },
    "excel": {
      title: "Microsoft Excel",
      category: "Bureautique",
      role: "Analyse de données & Calculs",
      purpose: "Tableur pour structurer des données, faire des bilans de liaison et tracer des graphiques.",
      description: "Outil indispensable de bureautique pour l'organisation et la structuration des plans d'adressage, la modélisation mathématique simple et l'analyse de métriques de performance réseau.",
      usage: "Utilisé pour formater des tableaux comparatifs, calculer des budgets de puissance théoriques pour les bilans de liaisons sans fil et concevoir des plannings de gestion de projets.",
      icon: "fas fa-file-excel"
    },
    "office365": {
      title: "Suite Microsoft Office 365",
      category: "Bureautique",
      role: "Productivité & Collaboration",
      purpose: "Rédaction de rapports d'études, présentations orales et communication d'équipe.",
      description: "Outils bureautiques indispensables (Word, PowerPoint, Outlook, Teams) permettant de structurer et formaliser des livrables professionnels de haute qualité, comme des rapports d'audit ou des documentations d'architecture.",
      usage: "Utilisé au quotidien pour la rédaction complète des comptes rendus techniques des SAÉ et la conception des supports de soutenances orales.",
      icon: "fas fa-briefcase"
    }
  };

  /* --- 2. MODAL SYSTEM --- */
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const closeModalBtn = document.querySelector('.modal-close-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const softwareCards = document.querySelectorAll('.software-logo-card');

  // Create dynamic Lightbox for image zooming
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  `;
  lightbox.innerHTML = `
    <button style="position:absolute; top:25px; right:25px; background:none; border:none; color:#fff; font-size:2rem; cursor:pointer;" id="lightbox-close"><i class="fas fa-times"></i></button>
    <img style="max-width:90%; max-height:90%; object-fit:contain; border: 2px solid rgba(255,255,255,0.1); border-radius:8px; cursor: zoom-out;" id="lightbox-img" src="" alt="">
  `;
  document.body.appendChild(lightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.closest('#lightbox-close') || e.target.id === 'lightbox-img') {
      lightbox.style.opacity = '0';
      lightbox.style.pointerEvents = 'none';
    }
  });

  const triggerLightbox = (src) => {
    const img = lightbox.querySelector('#lightbox-img');
    img.src = src;
    lightbox.style.opacity = '1';
    lightbox.style.pointerEvents = 'all';
  };

  const openModal = (projectId) => {
    const data = projectsData[projectId];
    if (!data) return;

    // Build Slider Slides
    let slidesHTML = '';
    data.gallery.forEach((item) => {
      if (item.src.endsWith('.pdf')) {
        slidesHTML += `
          <div class="slider-slide">
            <iframe src="${item.src}" title="${item.caption}"></iframe>
          </div>
        `;
      } else {
        slidesHTML += `
          <div class="slider-slide">
            <img src="${item.src}" alt="${item.caption}" class="zoomable-img" style="cursor: zoom-in;">
          </div>
        `;
      }
    });

    // Determine if slider controls are needed
    const showControls = data.gallery.length > 1;
    const controlsHTML = showControls ? `
      <button class="slider-arrow slider-arrow-prev" aria-label="Image précédente"><i class="fas fa-chevron-left"></i></button>
      <button class="slider-arrow slider-arrow-next" aria-label="Image suivante"><i class="fas fa-chevron-right"></i></button>
      <div class="slider-counter">1 / ${data.gallery.length}</div>
    ` : '';

    let actionBtn = '';
    if (data.btnHref) {
      actionBtn = `<a href="${data.btnHref}" target="_blank" class="btn-pill btn-pill-primary" style="margin-top: 1.5rem; display: inline-flex;"><i class="fas fa-file-arrow-down"></i> ${data.btnText}</a>`;
    }

    // Build Configs HTML (support array or single string)
    let showConfigs = data.configs && data.configs !== null;
    let configsHTML = '';
    if (showConfigs) {
      if (Array.isArray(data.configs)) {
        data.configs.forEach((cfg) => {
          configsHTML += `
            <details class="config-details">
              <summary class="config-summary">
                <span>${cfg.name}</span>
                <i class="fas fa-chevron-down toggle-icon" style="transition: transform 0.2s;"></i>
              </summary>
              <div class="cmd-box" style="max-height: 250px; overflow-y: auto; margin-top: 0; border: none; border-radius: 0;">
                <code class="cmd-line">${cfg.code.replace(/\\n/g, '<br>').replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')}</code>
              </div>
            </details>
          `;
        });
      } else {
        configsHTML += `
          <details class="config-details">
            <summary class="config-summary">
              <span>Afficher la configuration / code source</span>
              <i class="fas fa-chevron-down toggle-icon" style="transition: transform 0.2s;"></i>
            </summary>
            <div class="cmd-box" style="max-height: 250px; overflow-y: auto; margin-top: 0; border: none; border-radius: 0;">
              <code class="cmd-line">${data.configs.replace(/\\n/g, '<br>').replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')}</code>
            </div>
          </details>
        `;
      }
    }

    modalContent.innerHTML = `
      <div class="modal-header">
        <div class="modal-badges">
          <span class="modal-badge">${data.category}</span>
          <span class="modal-badge">${data.date}</span>
        </div>
        <h2>${data.title}</h2>
      </div>

      <!-- Navigation Tabs -->
      <div class="modal-tabs">
        <button class="modal-tab-btn active" data-tab="context">Contexte & Objectifs</button>
        <button class="modal-tab-btn" data-tab="realisation">Réalisation</button>
        <button class="modal-tab-btn" data-tab="results">Résultats & Configs</button>
        <button class="modal-tab-btn" data-tab="gallery">Galerie & Médias</button>
        <button class="modal-tab-btn" data-tab="conclusion">Conclusion</button>
      </div>

      <!-- TAB 1: CONTEXTE & OBJECTIFS -->
      <div class="modal-tab-panel active" id="tab-context">
        <div class="modal-body">
          <div class="modal-left">
            <div class="slider-container" style="aspect-ratio: 16/10;">
              <div class="slider-slide">
                ${data.gallery[0].src.endsWith('.pdf') 
                  ? `<iframe src="${data.gallery[0].src}"></iframe>` 
                  : `<img src="${data.gallery[0].src}" alt="${data.gallery[0].caption}" class="zoomable-img" style="cursor: zoom-in;">`}
              </div>
            </div>
            ${actionBtn}
          </div>
          <div class="modal-right">
            <div>
              <span class="modal-section-label">Contexte du projet</span>
              <p class="modal-desc">${data.context}</p>
            </div>
            <div>
              <span class="modal-section-label">Objectifs visés</span>
              <p class="modal-desc">${data.objectives}</p>
            </div>
            <div>
              <span class="modal-section-label">Matériels et logiciels exploités</span>
              <div class="skills-list" style="margin-top: 0.5rem;">
                ${data.tools.map(t => `<span class="skill-tag" style="font-size:0.8rem; padding: 5px 12px;">${t}</span>`).join(' ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: REALISATION (PARTIE 1 & 2) -->
      <div class="modal-tab-panel" id="tab-realisation">
        <div class="modal-body">
          <div class="modal-left">
            <span class="modal-section-label">Partie 1 : Conception & Intégration</span>
            <p class="modal-desc" style="font-size:0.95rem;">${data.part1}</p>
          </div>
          <div class="modal-right">
            <span class="modal-section-label">Partie 2 : Modélisation & Étude technique</span>
            <p class="modal-desc" style="font-size:0.95rem;">${data.part2}</p>
          </div>
        </div>
      </div>

      <!-- TAB 3: RESULTATS & CONFIGS -->
      <div class="modal-tab-panel" id="tab-results">
        ${showConfigs ? `
        <!-- Section Fichiers de Configuration en haut (Pleine largeur) -->
        <div style="padding: 2rem 3rem 0.5rem 3rem;">
          <span class="modal-section-label">Fichier(s) de Configuration / Code source</span>
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem;">
            ${configsHTML}
          </div>
        </div>
        ` : ''}
        
        <!-- Section Analyses et Tableaux en bas (Côte à côte) -->
        <div class="modal-body" style="padding-top: 1.5rem; ${showConfigs ? 'border-top: 1px solid var(--border-color);' : ''}">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <span class="modal-section-label">Analyse des Résultats & Validations</span>
            <div class="modal-desc" style="font-size:0.95rem; margin-top: 0;">${data.results}</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; min-width: 0;">
            <span class="modal-section-label">Tableau de données</span>
            <div style="margin-top: 0; overflow-x: auto; max-width: 100%; width: 100%; box-sizing: border-box;">${data.table.replace("class='modal-table'", "class='modal-table' style='margin-top: 0.5rem; min-width: 450px;'")}</div>
          </div>
        </div>
      </div>

      <!-- TAB 4: GALLERY & DOCUMENTS -->
      <div class="modal-tab-panel" id="tab-gallery">
        <div style="padding: 0 3rem 3rem 3rem;">
          <div class="slider-container" style="max-height: 400px;">
            <div class="slider-wrapper">
              ${slidesHTML}
            </div>
            ${controlsHTML}
          </div>
          <div class="slider-caption-wrapper" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div style="flex: 1; min-width: 250px;">
              <span class="modal-section-label">Description du média (Cliquez sur l'image pour l'agrandir)</span>
              <p class="slider-caption">${data.gallery[0].caption}</p>
            </div>
            <div>
              ${actionBtn}
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 5: CONCLUSION -->
      <div class="modal-tab-panel" id="tab-conclusion">
        <div style="padding: 2rem 3rem 4rem 3rem; max-width: 800px; margin: 0 auto; text-align: center;">
          <i class="fas fa-graduation-cap fa-4x" style="color: var(--accent); margin-bottom: 2rem;"></i>
          <h3 style="margin-bottom: 1rem; text-transform: uppercase;">Conclusion du projet</h3>
          <p class="modal-desc" style="font-size: 1.15rem; line-height: 1.8; margin-bottom: 2.5rem; text-align: justify;">
            ${data.conclusion}
          </p>
          ${actionBtn}
        </div>
      </div>
    `;

    // Bind click to zoom triggers for all zoomable images
    const zoomableImgs = modalContent.querySelectorAll('.zoomable-img');
    zoomableImgs.forEach(img => {
      img.addEventListener('click', () => {
        triggerLightbox(img.src);
      });
    });

    // 1. Tab switching logic
    const tabBtns = modalContent.querySelectorAll('.modal-tab-btn');
    const tabPanels = modalContent.querySelectorAll('.modal-tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        modalContent.querySelector(`#tab-${targetTab}`).classList.add('active');
      });
    });

    // 2. Gallery Slider logic (Only if multiple items)
    if (showControls) {
      let currentSlide = 0;
      const totalSlides = data.gallery.length;
      const wrapper = modalContent.querySelector('.slider-wrapper');
      const counter = modalContent.querySelector('.slider-counter');
      const caption = modalContent.querySelector('.slider-caption');
      const prevBtn = modalContent.querySelector('.slider-arrow-prev');
      const nextBtn = modalContent.querySelector('.slider-arrow-next');

      const updateSlider = (index) => {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;

        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        caption.textContent = data.gallery[currentSlide].caption;
      };

      prevBtn.addEventListener('click', () => updateSlider(currentSlide - 1));
      nextBtn.addEventListener('click', () => updateSlider(currentSlide + 1));
    }

    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const openSoftwareModal = (softwareId) => {
    const data = softwareData[softwareId];
    if (!data) return;

    let mediaHTML = `<div style="height:100%; min-height:280px; display:flex; align-items:center; justify-content:center; color:var(--text-primary);"><i class="${data.icon} fa-8x" style="font-size: 8rem;"></i></div>`;

    modalContent.innerHTML = `
      <div class="modal-header">
        <div class="modal-badges">
          <span class="modal-badge">${data.category}</span>
          <span class="modal-badge">${data.role}</span>
        </div>
        <h2>${data.title}</h2>
      </div>
      <div class="modal-body">
        <div class="modal-left">
          <div class="modal-media-box">
            ${mediaHTML}
          </div>
        </div>
        <div class="modal-right">
          <div>
            <span class="modal-section-label">À QUOI SERT-IL ? (Objectif principal)</span>
            <p class="modal-desc" style="font-weight: 600; color: var(--text-primary);">${data.purpose}</p>
          </div>
          <div>
            <span class="modal-section-label">Présentation & Contexte d'usage</span>
            <p class="modal-desc">${data.description}</p>
          </div>
          <div class="spec-grid">
            <div class="spec-item" style="grid-column: span 2;">
              <span class="modal-section-label">Cas d'usage concrets exploités</span>
              <p style="font-size: 1rem; color: var(--text-secondary); line-height: 1.6;">${data.usage}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (id) openModal(id);
    });
  });

  softwareCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-software-id');
      if (id) openSoftwareModal(id);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  /* --- 3. DYNAMIC SEARCH & FILTERING --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('portfolioSearch');
  const noResultsMsg = document.getElementById('noResultsMsg');
  const countSpan = document.getElementById('portfolioCountNum');

  let activeFilter = 'all';
  let searchQuery = '';

  const applyFiltersAndSearch = () => {
    let visibleCount = 0;
    const cards = document.querySelectorAll('.projects-grid .project-card');

    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      const searchableText = (card.getAttribute('data-title') || '').toLowerCase();
      
      const matchesFilter = (activeFilter === 'all' || category === activeFilter);
      const matchesSearch = (!searchQuery || searchableText.includes(searchQuery));

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
        visibleCount++;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.style.display = 'none'; }, 200);
      }
    });

    if (countSpan) countSpan.textContent = visibleCount;

    if (noResultsMsg) {
      if (visibleCount === 0) {
        noResultsMsg.style.display = 'block';
      } else {
        noResultsMsg.style.display = 'none';
      }
    }
  };

  if (filterBtns) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        applyFiltersAndSearch();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFiltersAndSearch();
    });
  }

  /* --- 4. FAQ ACCORDION TOGGLE --- */
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        faqItems.forEach(i => {
          i.classList.remove('active');
          const ans = i.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
        });
        
        if (!isOpen) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    }
  });

  /* --- 5. THEME MANAGER --- */
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    toggleBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  /* --- 6. SCROLL REVEAL OBSERVER --- */
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
});
