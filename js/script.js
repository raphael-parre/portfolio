document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. PROJETS DE RAPHAEL PARRÉ AVEC GALERIES PHOTOS --- */
  const projectsData = {
    "sae-reseau-sec": {
      title: "SAE CYBER 401 Sécuriser un système d’information",
      category: "Réseaux & Sécurité",
      date: "BUT 2 — 2026",
      context: "Conception, déploiement, sécurisation et audit offensif/défensif d'un réseau d'entreprise multi-sites dans le cadre de la SAE 401. Ce projet s'articule autour de trois phases distinctes : la mise en place physique et logique du réseau de l'entreprise, la sécurisation et le durcissement des équipements et services, et enfin, une phase d'attaque (pentest réciproque) visant à éprouver la robustesse de l'infrastructure.",
      objectives: "Assurer la disponibilité des services réseau critiques en DMZ (DNS public, serveur Web HTTPS, serveur de messagerie), configurer un routage dynamique inter-sites sécurisé par un tunnel VPN IPsec (StrongSwan/Cisco), appliquer des politiques de sécurité strictes sur les commutateurs (Port-Security, BPDU Guard, DTP disable) et routeurs (ACLs de filtrage, SSH restrictif), puis mener un audit offensif externe et interne (Nmap, Nikto, Dirb, Hydra).",
      tools: ["Cisco IOS CLI", "Debian GNU/Linux", "StrongSwan (IPsec)", "BIND9 (DNS)", "Postfix, Dovecot & hMailServer", "Apache2 & OpenSSL", "Kali Linux (Nmap, Hydra, Nikto, Dirb, Netdiscover)"],
      part1: "<strong>Mise en place de l'infrastructure réseau (Phase 1) :</strong><br>• <strong>Segmentation Logique & VLANs :</strong> Création de VLANs pour isoler les flux (VLAN 10 DATA, VLAN 30 INTRANET, VLAN 99 ADMIN) sur les commutateurs Cisco.<br>• <strong>Services Web & DNS :</strong> Déploiement d'un serveur Web public (Apache en HTTPS via SSL/TLS), d'un serveur intranet privé et de serveurs DNS (racine, DNS privé local, DNS public BIND9).<br>• <strong>Messagerie & VPN IPsec :</strong> Configuration de serveurs de messagerie (Postfix/Dovecot et hMailServer) et interconnexion sécurisée de site à site par tunnel VPN IPsec (Tunnel10, chiffrement AES-256 et clés DH robustes) reliant le site principal à sa succursale.",
      part2: "<strong>Sécurisation & Durcissement (Phase 2) :</strong><br>• <strong>Sécurisation de Couche 2 (Switchs) :</strong> Activation du <em>Port-Security</em> (limite à 2 adresses MAC mémorisées dynamiquement par port avec violation <i>restrict</i>), désactivation du protocole DTP (saut de VLAN) via <i>nonegotiate</i>, et activation de <em>BPDU Guard</em> / <em>Portfast</em> contre le root spoofing Spanning-Tree.<br>• <strong>Filtrage par ACL & SSH :</strong> Restriction stricte des accès de configuration SSH aux commutateurs et routeurs via l'ACL standard <i>ACL-ADMIN-ONLY</i> autorisant uniquement la machine d'administration (192.168.99.25), et mise en place d'ACLs de filtrage sur le routeur LAN bloquant l'accès à l'Intranet depuis la DMZ.",
      results: "<strong>Validation & Audit (Phase 3) :</strong><br>• <strong>Reconnaissance Externe :</strong> Scan Nmap ayant identifié les ports critiques exposés (SSH port 22, SMTP port 25, HTTP port 80), scan Nikto révélant l'absence d'en-têtes <i>X-Frame-Options</i> (vulnérabilité au Clickjacking) et Dirb découvrant le répertoire <i>/server-status</i>.<br>• <strong>Exploitation Interne :</strong> Scan Netdiscover pour cartographier le réseau et brute-force SSH avorté à l'aide de Hydra suite à l'usage d'un algorithme d'échange de clés obsolète (diffie-hellman-group1-sha1) sur le matériel Cisco, ce qui a mis en évidence le besoin de durcir les clés de chiffrement de l'infrastructure.<br>• <strong>Privilèges :</strong> Identification et gestion fine des 3 niveaux de privilèges d'administration (SuperAdmin, Admin, Opérateur) pour limiter les droits d'accès aux configurations.",
      table: "<table class='modal-table'>" +
             "<thead><tr><th>Zone</th><th>VLAN</th><th>Réseau IPv4</th><th>Services associés / Rôle</th></tr></thead>" +
             "<tbody>" +
             "<tr><td>LAN DATA</td><td>VLAN 10</td><td>192.168.10.0/24</td><td>Postes clients et utilisateurs</td></tr>" +
             "<tr><td>Intranet</td><td>VLAN 30</td><td>192.168.30.0/24</td><td>Serveur web interne de l'entreprise</td></tr>" +
             "<tr><td>Administration</td><td>VLAN 99</td><td>192.168.99.0/24</td><td>PC Administrateur (192.168.99.25) & Management</td></tr>" +
             "<tr><td>DMZ Publique</td><td>-</td><td>10.0.0.0/28</td><td>Serveurs publics (Mail 10.0.0.3, Web 10.0.0.1, DNS 10.0.0.2)</td></tr>" +
             "</tbody></table>",
      configs: [
        {
          name: "Sécurisation switch (Port-Security, DTP & BPDU Guard)",
          code: `! Configuration de la sécurisation des interfaces utilisateurs
interface GigabitEthernet0/4
 switchport mode access
 switchport nonegotiate
 switchport port-security maximum 2
 switchport port-security
 switchport port-security violation restrict
 switchport port-security mac-address sticky
 shutdown
 spanning-tree portfast
 spanning-tree bpduguard enable`
        },
        {
          name: "Filtrage et Restriction d'administration SSH (Routeur/Switch)",
          code: `! Création de l'ACL pour restreindre les connexions d'administration
ip access-list standard ACL-ADMIN-ONLY
 permit 192.168.99.25
 deny   any
!
! Application de la restriction d'accès SSH sur les lignes virtuelles VTY
line vty 0 4
 access-class ACL-ADMIN-ONLY in
 exec-timeout 1 0
 login local
 transport input ssh
line vty 5 15
 access-class ACL-ADMIN-ONLY in
 exec-timeout 1 0
 login local
 transport input ssh`
        },
        {
          name: "Configuration du Tunnel VPN IPsec (Routeur Site Secondaire)",
          code: `! Configuration de l'interface Tunnel logique IPsec inter-sites
interface Tunnel10
 ip address 172.16.0.2 255.255.0.0
 tunnel source 203.0.113.13
 tunnel mode ipsec ipv4
 tunnel destination 203.0.113.11
 tunnel protection ipsec profile IPSECPROFILE
!
! Routage vers le site distant à travers le tunnel VPN
ip route 10.0.0.0 255.255.255.240 172.16.0.1
ip route 192.168.0.0 255.255.0.0 172.16.0.1`
        }
      ],
      conclusion: "Cette SAE 401 a permis de concrétiser le déploiement d'une architecture multi-sites sécurisée de bout en bout. L'exercice d'audit offensif réciproque a prouvé qu'une politique de sécurité n'est efficace que si elle englobe aussi bien la couche de transport que la couche applicative et le durcissement du plan de contrôle des équipements d'infrastructure.",
      gallery: [
        { src: "SAE401/Structure_Reseau_Frain_Parre.png", caption: "Topologie globale de l'infrastructure réseau multi-sites sécurisée." },
        { src: "SAE401/image1.png", caption: "Configuration logique et physique des interconnexions dans Cisco Packet Tracer." },
        { src: "SAE401/image2.png", caption: "Table de routage dynamique et interfaces configurées pour les agences." },
        { src: "SAE401/nmap_mail.png", caption: "Scan de vulnérabilités Nmap et smtp-enum-users sur les adresses cibles." },
        { src: "SAE401/nmap_nantes.png", caption: "Résultats du scan Nmap complet de l'infrastructure extérieure." },
        { src: "SAE401/hydra.png", caption: "Tentative de brute-force SSH avec Hydra révélant des algorithmes obsolètes." }
      ],
      btnHref: "SAE401/Compte rendu SAE 401.pdf",
      btnText: "Télécharger le compte rendu (PDF)"
    },
    "sae-cyber-audit": {
      title: "SAE3.CYBER.04 - Découvrir le pentesting",
      category: "Cybersécurité",
      date: "BUT 2 — 2025",
      context: "Réalisation d'un audit de sécurité et de tests d'intrusion sur la plateforme web DVWA (Damn Vulnerable Web Application) dans le cadre de la SAE3.CYBER.04. Le projet a consisté dans un premier temps à adopter la posture d'un hacker éthique pour auditer et exploiter les vulnérabilités du site (niveaux Low, Medium, High), puis dans un second temps à proposer et implémenter des correctifs de code PHP et des mesures de durcissement adaptées pour sécuriser définitivement l'application.",
      objectives: "Identifier et exploiter les vulnérabilités majeures du Top 10 OWASP, manipuler les requêtes HTTP via un proxy d'interception, automatiser la recherche de mots de passe, analyser des requêtes de base de données SQL et concevoir des contre-mesures de développement sécurisé (requêtes préparées, jetons de validation).",
      tools: ["Kali Linux", "Burp Suite (Proxy)", "Hydra (Brute-force)", "Nmap & Dirb", "PHP & MySQL", "CrackStation (Hash Crack)"],
      part1: "<strong>Méthodologie d'Audit Offensif & Correctifs :</strong><br>• <strong>Hacker en éthique (Offensif) :</strong> Analyse des flux et interception des requêtes HTTP/HTTPS à l'aide de Burp Suite, énumération réseau et forçage de comptes par dictionnaire via Hydra.<br>• <strong>Développement Sécurisé (Correctifs) :</strong> Conception et intégration de corrections de code source PHP (usage systématique de requêtes préparées PDO contre les injections SQL, validation de captcha côté serveur et gestion de jetons uniques).",
      part2: "<strong>Attaques simulées sur DVWA :</strong><br>• <strong>1. Brute Force :</strong> Attaque automatisée par dictionnaire sur les requêtes GET afin de retrouver des identifiants valides.<br>• <strong>6. Insecure CAPTCHA :</strong> Contournement de la validation de CAPTCHA en manipulant les étapes de requêtes POST (step1 vers step2) dans Burp Suite.<br>• <strong>7. SQL Injection :</strong> Extraction de la base de données, des noms de tables, de colonnes, et récupération de hashs MD5 d'identifiants.",
      results: "<strong>Rapports d'audit et remédiations validés :</strong><br>• <strong>Exploitation :</strong> 100% des vulnérabilités DVWA ciblées exploitées avec succès.<br>• <strong>Résolution :</strong> 100% des failles résolues au niveau maximal (High/Impossible) après application de nos correctifs de code source PHP.",
      table: "<table class='modal-table'>" +
             "<thead><tr><th>Attaque DVWA</th><th>Type de faille</th><th>Criticité</th><th>Remédiation proposée</th></tr></thead>" +
             "<tbody>" +
             "<tr><td>1. Brute Force</td><td>Authentification faible</td><td>Élevée</td><td>Verrouillage de compte & Délai (Delay)</td></tr>" +
             "<tr><td>6. Insecure CAPTCHA</td><td>Contournement de validation</td><td>Moyenne</td><td>Vérification stricte côté serveur</td></tr>" +
             "<tr><td>7. SQL Injection</td><td>Injection de code SQL</td><td>Critique</td><td>Requêtes préparées PDO (bindParam)</td></tr>" +
             "</tbody></table>",
      configs: `// Exemple de correction PHP - Requêtes préparées PDO contre l'injection SQL
$id = $_GET['id'];
// Utilisation de requêtes préparées pour empêcher l'interprétation du code SQL injecté
$query = "SELECT first_name, last_name FROM users WHERE user_id = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $id, PDO::PARAM_INT);
$stmt->execute();
$results = $stmt->fetchAll();`,
      conclusion: "Cette SAE de pentesting m'a permis de comprendre de façon concrète la réalité des vulnérabilités applicatives. En apprenant à penser comme un attaquant pour exploiter les failles, j'ai acquis les compétences nécessaires pour concevoir des applications web durcies et mettre en place des politiques de sécurité efficaces.",
      gallery: [
        { src: "SAE3Cyber04/hydra_att.png", caption: "Configuration de la commande de force brute avec Hydra." },
        { src: "SAE3Cyber04/hydra_rslt.png", caption: "Lancement de l'attaque Hydra sur le formulaire de login." },
        { src: "SAE3Cyber04/succes_hydra.png", caption: "Succès de l'attaque brute force avec identification du mot de passe." },
        { src: "SAE3Cyber04/sql_req.png", caption: "Premiers tests d'injection SQL sur l'identifiant." },
        { src: "SAE3Cyber04/sql_req2.png", caption: "Erreur de syntaxe SQL retournée confirmant la vulnérabilité." },
        { src: "SAE3Cyber04/sql_req3.png", caption: "Exploitation UNION pour récupérer le nom de la base de données." },
        { src: "SAE3Cyber04/sql_req4.png", caption: "Extraction de la liste des tables de la base dvwa." },
        { src: "SAE3Cyber04/sql_req5.png", caption: "Récupération des colonnes de la table users." },
        { src: "SAE3Cyber04/sql_req6.png", caption: "Extraction des hashs MD5 des mots de passe des utilisateurs." },
        { src: "SAE3Cyber04/modf_mdp.png", caption: "Formulaire de changement de mot de passe protégé par le CAPTCHA." },
        { src: "SAE3Cyber04/burp_ana.png", caption: "Interception de la requête HTTP de l'étape 1 avec Burp Suite." },
        { src: "SAE3Cyber04/burp_POST.png", caption: "Requête POST montrant le paramètre de CAPTCHA et de step." },
        { src: "SAE3Cyber04/burp_step1.png", caption: "Analyse de l'étape 1 d'authentification CAPTCHA." },
        { src: "SAE3Cyber04/burp_step2.png", caption: "Modification de la requête POST pour forcer le passage à l'étape 2 sans CAPTCHA." },
        { src: "SAE3Cyber04/test_creden.png", caption: "Validation du changement de mot de passe réussi dans Test Credentials." }
      ],
      btnHref: "SAE3Cyber04/CR_SAECYBER.pdf",
      btnText: "Télécharger le compte rendu (PDF)"
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
        { src: "SAE201/entreprise photo.png", caption: "Topologie réseau complète sous Cisco Packet Tracer (salle des serveurs, FAI et agences)." },
        { src: "SAE201/VLANs.png", caption: "Diagramme de découpage et de routage des VLANs logiques configurés sur le switch principal." },
        { src: "SAE201/Zone secondaire entreprise.png", caption: "Maquette et routage de la zone secondaire de l'entreprise." },
        { src: "SAE201/partie routeur principale.png", caption: "Configuration de la partie routage principale de l'infrastructure." },
        { src: "SAE201/table des int .png", caption: "Table d'adressage et configuration des interfaces." }
      ],
      btnHref: "SAE201/SAE201_Parre_Raphael.png",
      btnText: "Télécharger la topologie (PNG)"
    },
    "sae-telecom-radio": {
      title: "SAE301 Système de communication radio — Modélisation Radio & Antennes",
      category: "Télécommunications",
      date: "Semestre 3 — 2026",
      context: "Étude théorique et expérimentale d'un système de transmission radio analogique AM/FM avec mesures expérimentales, simulation d'antennes et calcul d'un bilan de liaison. Ce projet allie des mesures de signaux réels effectuées sur analyseur de spectre à des modélisations électromagnétiques d'antennes et de propagation d'ondes.",
      objectives: "Maîtriser les concepts physiques de propagation des ondes (ligne de vue, diffraction), confronter la théorie à des mesures réelles, analyser les modulations AM/FM (immunité au bruit, signaux modulants), modéliser et simuler des diagrammes de rayonnement d'antennes directives, et calculer un bilan de liaison radio complet pour évaluer la qualité d'une liaison sans fil.",
      tools: ["MMANA-GAL Basic", "Analyseur de Spectre", "Récepteur / Démodulateur Radio", "Antenne Yagi-Uda", "Antenne Brin (Dipôle)", "Générateur de signaux AM/FM"],
      part1: "<strong>Étude de modulation AM/FM & Types d'antenne :</strong><br>• <strong>Modulations Analogiques :</strong> Analyse de la modulation d'amplitude (AM) où l'enveloppe du signal varie avec le signal modulant, et de la modulation de fréquence (FM) offrant une meilleure immunité aux parasites.<br>• <strong>Types d'Antennes :</strong> Étude comparative entre l'antenne brin (monopole/dipôle demi-onde) omnidirectionnelle et l'antenne directive Yagi-Uda (composée d'un trombone actif, d'un réflecteur arrière et de directeurs avant) pour concentrer la puissance d'émission.<br>• <strong>Propagation :</strong> Analyse des modes de propagation (ondes de sol, ondes directes en ligne de vue, et ondes ionosphériques).",
      part2: "<strong>Mesures expérimentales, Simulation & Bilan de liaison :</strong><br>• <strong>Mesures en laboratoire :</strong> Acquisition du signal FM réel de Skyrock (95.4 MHz) à l'aide d'une antenne et d'un analyseur de spectre, relevant une puissance reçue de -53.29 dBm.<br>• <strong>Modélisation & Rayonnement :</strong> Simulation sous MMANA-GAL des diagrammes de directivité. Une antenne Yagi adaptée offre un gain de 5.62 dBi tandis qu'une configuration non adaptée (162 kHz) dégrade le gain à -23 dBi.<br>• <strong>Bilan de liaison :</strong> Calcul de la perte de propagation en espace libre (68.38 dB pour 650m) et déduction de la puissance d'émission de l'émetteur (44.50 dBm soit 28.18 W).",
      results: "<strong>Validation expérimentale et théorique :</strong><br>• <strong>Spectre :</strong> Alignement parfait entre le spectre de modulation FM capté et les gabarits de bande passante.<br>• <strong>Simulation :</strong> Validation graphique du lobe de directivité avant étroit de 48° sur l'antenne Yagi.<br>• <strong>Calculs :</strong> Bilan de liaison résolu attestant de la viabilité de la réception du signal.",
      table: "<table class='modal-table'>" +
             "<thead><tr><th>Type d'antenne</th><th>Fréquence cible</th><th>Taille théorique</th><th>Gain max</th><th>Angle d'ouverture</th><th>Directivité</th></tr></thead>" +
             "<tbody>" +
             "<tr><td>Brin (dipôle)</td><td>95.4 MHz (FM)</td><td>1.57 m</td><td>2.16 dBi</td><td>~78°</td><td>Omnidirectionnelle</td></tr>" +
             "<tr><td>Brin (dipôle)</td><td>162 kHz (AM)</td><td>~925 m</td><td>2.15 dBi</td><td>Très large</td><td>Nulle (inexploitable)</td></tr>" +
             "<tr><td>Yagi-Uda</td><td>95.4 MHz (FM)</td><td>1.57 m (par brin)</td><td>5.62 dBi</td><td>~48°</td><td>Directive (face avant)</td></tr>" +
             "<tr><td>Yagi-Uda</td><td>162 kHz (AM)</td><td>Irréalisable</td><td>Très faible</td><td>-</td><td>Nulle</td></tr>" +
             "</tbody></table>",
      configs: null,
      conclusion: "Cette SAÉ 301 a mis en évidence le lien indissociable entre la théorie ondulatoire et la pratique radio. Nous avons pu concevoir des antennes virtuelles performantes avec MMANA-GAL, analyser des signaux FM en conditions réelles et calculer un bilan de liaison complet. Ces notions de directivité, de gain et d'atténuation sont cruciales pour dimensionner tout système de communication sans fil moderne.",
      gallery: [
        { src: "SAE301 Systeme de communication radio/ant_pas_adapt.png", caption: "Diagramme de rayonnement non adapté." },
        { src: "SAE301 Systeme de communication radio/ant_yagi_uda.png", caption: "Diagramme de directivité adapté simulé pour l'antenne Yagi-Uda." },
        { src: "SAE301 Systeme de communication radio/ant_yagi.png", caption: "Photo de l'antenne directive Yagi-Uda de test." },
        { src: "SAE301 Systeme de communication radio/anal_FM.png", caption: "Mesure spectrale d'un signal FM sur analyseur de spectre." },
        { src: "SAE301 Systeme de communication radio/ch_trans_radio.png", caption: "Montage expérimental de la chaîne de transmission radio." },
        { src: "SAE301 Systeme de communication radio/cha_trans.png", caption: "Schéma structurel de la chaîne de transmission analogique." },
        { src: "SAE301 Systeme de communication radio/mod_AM.png", caption: "Visualisation d'un signal modulé en amplitude (AM)." },
        { src: "SAE301 Systeme de communication radio/mod_FM.png", caption: "Visualisation d'un signal modulé en fréquence (FM)." },
        { src: "SAE301 Systeme de communication radio/type_propa.png", caption: "Schéma théorique des types de propagation des ondes radio." },
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
      role: "Outil d'audit offensif & Pentesting",
      purpose: "Distribution Linux dédié à la cybersécurité et aux tests de pénétration, préinstallée avec des centaines d'outils offensifs.",
      description: "Kali Linux est la distribution par exellence pour la cybersécurité. Elle regroupe des centaines d'outils spécialisés dans la recherche de vulnérabilités, l'analyse réseau, l'exploitation de failles, le reverse engineering, des outils de cracking.",
      usage: "Utilisé lors de la SAE3.Cyber04 pour cartographier le réseau, ensuite intercepter les flux avec Wireshark, tester la robustesse des mots de passe avec Hydra et analyser la sécurité applicative.",
      icon: "icons/kali_logo.avif"
    },
    "nmap": {
      title: "Nmap Scanner",
      category: "Cybersécurité",
      role: "Scanner de ports & Reconnaissance",
      purpose: "Découverte d'hôtes actifs, de ports ouverts et détection de services ou de systèmes d'exploitation.",
      description: "Nmap est un scanner de ports libre énormément utilisé pour débuter une phase de reconnaissance. Il permet d'obtenir des informations sur le système d'exploitation, un inventaire réseau précis et d'identifier les ports ouverts.",
      usage: "Exploité au début de l'audit de la SAÉ3.Cyber04 pour scanner la cible DVWA et repérer les services actifs (HTTP, SSH).",
      icon: "icons/nmap.png"
    },
    "metasploit": {
      title: "Metasploit",
      category: "Cybersécurité",
      role: "Tests d'exploitation de vulnérabilités",
      purpose: "Plateforme open source de recherche de vulnérabilités, développement et exécution d'exploits contre des systèmes.",
      description: "Metasploit est l'outil d'exploitation le plus utilisé en pentest. Il permet d'avoir accès à des milliers d'exploits, payload et modules auxilière permettant d'automatiser l'exploitation de failles basées sur des vulnérabilités connues.",
      usage: "Utilisé en SAE3.Cyber04 pour exploiter des vulnérabilités identifiées sur la machine cible et obtenir des accès privilégiés dans un environnement de lab isolé.",
      icon: "icons/metasploit.png"
    },
    "burpsuite": {
      title: "Burp Suite",
      category: "Cybersécurité",
      role: "Proxy HTTP d'interception et audit d'applications Web",
      purpose: "Application dédiés à l'analyse et l'audit de sécurité des applications Web en interceptant et modifiant le trafic HTTP/HTTPS.",
      description: "Burp Suite est la boîte à outils principal pour l'audit d'applications Web. Burp Suite est utilisé soit pour la sécurisation ou l'attaque d'applications web. De plus, Burp Suite agit comme un proxy intermédiaire, permettant d'intercepter les paquets, de modifier des requêtes et réponses, et d'automatiser des tests d'injection.",
      usage: "Utilisé dans la SAÉ3.Cyber04 pour analyser les échanges HTTP, intercepter les requêtes d'authentification Captcha de DVWA et exploiter les variables de session.",
      icon: "icons/BurpSuite_logo.png"
    },
    "hydra": {
      title: "Hydra",
      category: "Cybersécurité",
      role: "Brute-force de credentials",
      purpose: "Outil d'attaque par dictionnaire et force brute supportant de nombreux protocoles réseau pour tester la robustesse des mots de passe.",
      description: "Hydra est un outil de cracking permettant d'automatiser des attaques par dictionnaire sur des services d'authentification tels que SSH, FTP, HTTP, SMB ou RDP. Il est utilisé en pentest pour évaluer la solidité des mots de passe.",
      usage: "Utilisé lors de la SAÉ3.Cyber04 et SAE401 pour mener des attaques de force brute rapides par dictionnaire afin de tester la résistance des mots de passes et obtenir un accès.",
      icon: "icons/hydra-logo.png"
    },
    "gobuster": {
      title: "Gobuster",
      category: "Cybersécurité",
      role: "Fuzzing de répertoires & découverte web",
      purpose: "Outil de force brute permettant de découvrir des répertoires, fichiers cachés et sous-domaines sur des serveurs web via des listes de mots.",
      description: "Gobuster est utilisé pour découvrir les fichiers et répertoires masqués sur un serveur web en testant des milliers de chemins possible depuis un dictionnaire, ainsi que pour énumérer des sous-domaines. Il est couramment utilisé en phase de reconnaissance lors d'audits d'applications web pour trouver des axes exposés.",
      usage: "Déployé dans la SAE3.Cyber04 pour cartographier l'arborescence invisible de la plateforme web dvwa.",
      icon: "icons/gobuster-logo.svg"
    },
    "wireshark": {
      title: "Wireshark",
      category: "Cybersécurité / Réseaux",
      role: "Analyseur de trames réseau",
      purpose: "Outil de capture et d'analyse de trafic réseau permettant d'inspecter les paquets en temps réel sur une interface réseau.",
      description: "Wireshark est l'analyseur de trames réseau le plus utilisé au monde. Il permet de capturer des flux réseau, filtrer les paquets par protocole, localiser précisément l'origine de pannes réseau complexes (perte de paquets, lenteurs protocolaires) et pour identifier des comportements malveillants ou suspects (ex. balayages de ports Nmap, requêtes brutes de brute force ou tentatives d'injection SQL).",
      usage: "Application de filtres complexes de paquets (ip.addr, tcp.flags), suivi de flux TCP/HTTP. Wireshark est principalement utilisé en TP réseau afin d'observer et comprendre les échanges de protocoles. Il permet aussi de confirmer le fonctionnement d'application avec l'échange de paquet.",
      icon: "icons/Wireshark.png"
    },
    "Linux": {
      title: "Linux et autre distributions (Debian, Ubuntu)",
      category: "Systèmes",
      role: "Système d'exploitation open source",
      purpose: "Système d'exploitation open source basé sur le noyau Linux, utilisé aussi bien sur des serveurs, postes de travail que des équipements embarqués.",
      description: "Linux est le système d'exploitation open source le plus répandu dans le monde professionnel et académique. Administré principalement en ligne de commande, il offre une grande flexibilité, une stabilité accruee et constitue la base de nombreuses distributions spécialisées (Debian, Kali, Ubuntu…).",
      usage: "Utilisé tout au long du BUT R&T comme environnement principal d'administration système, de scripting Bash et de déploiement de services réseau, aussi bien en machine native qu'en machine virtuelle.",
      icon: "devicon-linux-plain"
    },
    "windows-server": {
      title: "Windows Server",
      category: "Réseaux & Systèmes",
      role: "Système d'exploitation serveur Microsoft",
      purpose: "OS serveur de Microsoft permettant de gérer des infrastructures d'entreprise avec Active Directory, DNS, DHCP et services de fichiers.",
      description: "Windows Server est la plateforme serveur dans les environnements Microsoft. Il centralise la gestion des comptes utilisateurs via Active Directory, le contrôle d'accès aux ressources partagées de fichiers et héberge des services critiques tels que DNS, DHCP, IIS et RDS.",
      usage: "Utilisé lors de SAE et TP pour la configuration de services DHCP/DNS Windows.",
      icon: "devicon-windows8-original"
    },
    "virtualbox": {
      title: "VirtualBox",
      category: "Réseaux & Systèmes",
      role: "Hyperviseur de machines visuelles",
      purpose: "Logiciel de virtualisation permettant de créer et exécuter plusieurs systèmes d'exploitation simultanément sur une même machine hôte.",
      description: "VirtualBox est un hyperviseur de type 2 qui permet de faire tourner plusieurs systèmes d'exploitation (Linux, Windows Server) sur la même machine physique. Il est largement utilisé pour simuler des environnements réseau complets.",
      usage: "Utilisé pour héberger et tester l'architecture de serveurs virtuels Debian et les machines d'audit lors des SAÉ401 et SAE3.Cyber04. C'est également un outil utilisé durant tout l'IUT, une grande partie de nos TPs se font sur machine virtuelle.",
      icon: "icons/virtualbox.png"
    },
    "cisco": {
      title: "Cisco IOS",
      category: "Réseaux",
      role: "Système d'exploitation pour équipements Cisco",
      purpose: "OS embarqué sur les routeurs et switchs Cisco, administré en ligne de commande pour configurer et gérer les équipements réseau.",
      description: "Cisco IOS (Internetwork Operating System) est le système d'exploitation qui configure la majorité des équipements réseau Cisco. Il permet de configurer le routage (OSPF, RIP, BGP), les VLANs, les ACL, des applications le NAT/PAT, les protocoles de spanning tree et les protocoles de défenses réseaux via une interface CLI structurée.",
      usage: "tilisé dans les SAE et TP réseaux pour configurer des routeurs et switchs Cisco, mettre en place des topologies IP et administrer des protocoles de routage dynamique, VPN IPsec, protocoles de défenses. Les équipements Cisco sont la base de notre formation, nous nous entrainons à configurer Switch et Routeur à chaque TP afin d'avoir un réseaux stable, fonctionnel, redondant et sécurisé.",
      icon: "icons/Cisco_logo.png"
    },
    "packet-tracer": {
      title: "Cisco Packet Tracer",
      category: "Réseaux",
      role: "Simulation de topologies réseaux",
      purpose: "Logiciel de simulation réseau développé par Cisco permettant de concevoir, configurer et tester des topologies sans équipement physique.",
      description: "Packet Tracer est une application offrant un environnement virtuel complet pour expérimenter la configuration d'équipements Cisco. Il supporte le routage, la VoIP, le Wi-FI et les protocoles IoT, ce qui en fait un outil incontournable pour les formations réseau et la créaion d'architecture réseau.",
      usage: "Utilisé dans la SAE2.01 et durant tout le BUT R&T pour simuler des architectures d'entreprises, simuler des configurations OSPF/VLAN/NAT, simuler des connexion Wi-Fi et serveur Web/DNS/Mail afin de valider des topologies.",
      icon: "icons/Cisco_packet_tracer.webp"
    },
    "docker": {
      title: "Docker",
      category: "Réseaux & Systèmes",
      role: "Plateforme de conteneurisation",
      purpose: "Outil de conteneurisation permettant d'empaqueter des applications et leurs dépendances dans des conteneurs légers et portables.",
      description: "Docker permet d'encapsuler des applications et services applicatifs (serveurs web, bases de données ou conteneurs d'outils d'audit cyber) au sein d'environnement isolés appellé conteneurs, plus légers que des machines virtuelles. Cela évite les conflits de dépendances système, accélère grandement le déploiement et améliore la reproductibilité.",
      usage: "Utilisé durant les TP pour déployer rapidement des services (serveurs web) et tester des environnements.",
      icon: "devicon-docker-plain"
    },
    "mysql": {
      title: "MySQL",
      category: "Réseaux & Systèmes",
      role: "Gestion de bases de données relationnelles",
      purpose: "SGBD permettant de stocker, organiser et interroger des données structurées via le langage SQL.",
      description: "MySQL est l'un des systèmes de gestion de bases de données les plus populaires au monde, particulièrement dans les applications web. Il permet de modéliser des données sous forme de tables, d'exécuter des requêtes complexes et de gérer les droits d'accès par utilisateurs.",
      usage: "Manipulé durant plusieurs TP et SAE dédié dans le cadre du développement de serveurs web et base de données. Par exemple, MySQL a été utilisé comme gestion de base de données pour une SAE dont le but était de concevoir une application de messagerie sécurisée.",
      icon: "devicon-mysql-plain"
    },
    "git": {
      title: "Git",
      category: "Réseaux & Systèmes",
      role: "Gestionnaire de versions de projets & scripts",
      purpose: "Système de contrôle de version permettant de suivre les modifications du code source et de collaborer efficacement en équipe.",
      description: "Git est essentiel pour maintenir un historique des modifications apportées aux scripts d'administration système ou aux fichiers de configurations réseaux, et pour collaborer efficacement à plusieurs sur des projets de déploiement.",
      usage: "Commandes de base (git init, add, commit, push, pull, clone).",
      icon: "devicon-git-plain"
    },
    "bash": {
      title: "Bash Scripting",
      category: "Réseaux & Systèmes",
      role: "Automatisation & scripting système",
      purpose: "Langage de script interprété par le shell Linux permettant d'automatiser des tâches système, réseau et de sécurité.",
      description: "Le scripting Bash permet d'enchaîner des commandes Linux en scripts exécutables pour automatiser des opérations répétitives. En cybersécurité, il est utilisé pour créer des outils d'énumération, de scan ou d'exploitation rapides et personnalisés.",
      usage: "Utilisé pour automatiser des tâches d'administration Linux, créer des scripts de reconnaissance réseau et développer des outils personnalisés dans le cadre des SAE et entraînements pentest.",
      icon: "devicon-bash-plain"
    },
    "vscode": {
      title: "Visual Studio Code",
      category: "Code & Développement",
      role: "Éditeur de code extensible",
      purpose: "Éditeur de code source léger et extensible de Microsoft, compatible avec la quasi-totalité des langages de programmation.",
      description: "VS Code est l'éditeur de développement le plus populaire grâce à ses extensions, son intégration Git native et ses fonctionnalités d'autocomplétion. Il s'adapte à tous les usages, du développement web à la programmation système.",
      usage: "Utilisé comme environnement principal de développement pour le portfolio web (HTML/CSS/JS), les scripts Python et Bash, ainsi que tous les projets de développement du BUT R&T.",
      icon: "devicon-vscode-plain"
    },
    "eclipse": {
      title: "Eclipse IDE",
      category: "Code & Développement",
      role: "IDE Java & développement applicatif",
      purpose: "Environnement de développement intégré principalement orienté Java, offrant des outils de compilation, débogage et gestion de projets.",
      description: "Eclipse est un IDE classique et complet utilisé pour le développement d'applications logicielles d'envergure, avec une gestion du débogage, suivi de projet et des outils pour le développement orienté objet.",
      usage: "Utilisé lors de TP et SAE pour développer des programmes en Java comme une application de messagerie sécurisée durant mon cursus BUT.",
      icon: "devicon-eclipse-plain"
    },
    "python": {
      title: "Python 3",
      category: "Language de programmation polyvalent",
      role: "Automatisation de scripts & analyses",
      purpose: "Langage lisible et polyvalent, très utilisé en scripting (utile pour l'administration), automatisation, cybersécurité, traitement et analyse de données.",
      description: "Python est le langage idéal pour automatiser le traitement de données, écrire des scripts d'administration. En cybersécurité, il permet de développer des exploits, des outils réseau, des scripts d'énumération et d'analyser des données rapidement..",
      usage: "Utilisé pour concevoir des scripts de parsing de fichiers logs et des scripts d'interrogations réseaux.",
      icon: "devicon-python-plain"
    },
    "mmana-gal": {
      title: "MMANA-GAL Basic",
      category: "Télécommunications",
      role: "Simulation & modélisation d'antennes",
      purpose: "Logiciel de simulation électromagnétique permettant de modéliser, analyser et optimiser des antennes radioélectriques ainsi qu'analyser leur diagramme de rayonnement.",
      description: "MMANA-GAL est un logiciel de simulation d'antennes basé sur la méthode des moments. Il permet d'étudier le gain, l'impédance, le rapport avant/arrière et le diagramme de rayonnement 2D/3D d'une antenne en fonction de sa géométrie et de la fréquence.",
      usage: "Utilisé lors de la SAÉ3.01 pour simuler et comparer les comportements d'adaptation et de directivité d'antennes dipôles et d'antennes directives Yagi-Uda, dipôles.",
      icon: "fas fa-satellite-dish"
    },
    "octave": {
      title: "GNU Octave",
      category: "Télécommunications",
      role: "Calcul numérique, simulation & traitement du signal",
      purpose: "Environnement de calcul numérique compatible MATLAB, dédié aux calculs matriciels et à la modélisation de systèmes.",
      description: "Très similaire à MATLAB, GNU Octave est un langage de programmation principalement destiné aux calculs numériques, traitement du signal et la modélisation mathématique.",
      usage: "Exploité pour modéliser des filtres de transmission, simuler des modulations analogiques et tracer des courbes théoriques de propagation.",
      icon: "icons/Gnu-octave-logo.png"
    },
    "labview": {
      title: "LabVIEW",
      category: "Télécommunications",
      role: "Programmation graphique & instrumentation",
      purpose: "Développement graphique pour le contrôle d'instruments de mesure et l'acquisition de signaux.",
      description: "LabVIEW est un environnement de développement graphique conçu par National Instruments. Il permet d'interagir facilement avec des appareils de mesure physiques, de traiter les signaux en temps réel et de concevoir des interfaces d'instrumentation complexes.",
      usage: "Utilisé lors de TP pour concevoir des chaînes de réception et d'acquisition de données sur des tests radio.",
      icon: "icons/labview-logo.webp"
    },
    "excel": {
      title: "Microsoft Excel",
      category: "Bureautique",
      role: "Tableur, analyse de données & calculs",
      purpose: "Tableur de Microsoft permettant de créer des tableaux de calcul, des graphiques et d'analyser des données via des formules et tableaux croisés dynamiques.",
      description: "Excel est l'outil de base pour la manipulation et l'analyse de données structurées. Il offre des fonctionnalités avancées telles que les macros, les tableaux croisés dynamiques et les graphiques pour produire des rapports professionnels.",
      usage: "Utilisé pour formater des tableaux comparatifs, concevoir des plannings de gestion de projets. Particulièrement, utilisé en entreprise pour divers projets (maintenance, surveillance, étude)",
      icon: "fas fa-file-excel"
    },
    "office365": {
      title: "Suite Microsoft Office 365",
      category: "Bureautique",
      role: "Suite bureautique",
      purpose: "Suite d'applications Microsoft regroupant Word, Excel, PowerPoint, Teams et Outlook, accessibles depuis le cloud.",
      description: "Outils bureautiques indispensables (Word, PowerPoint, Outlook, Teams) permettant de structurer et formaliser des livrables professionnels de haute qualité, comme des rapports d'audit ou des documentations d'architecture.",
      usage: "Utilisé au quotidien pour la rédaction complète des comptes rendus techniques des SAE et la conception des supports de soutenances orales.",
      icon: "icons/Office-365.png"
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
  window.triggerLightbox = triggerLightbox;

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
        <div class="modal-body" style="align-items: stretch; display: grid; grid-template-columns: 1fr 1fr; gap: 3.5rem;">
          <div class="modal-left" style="display: flex; flex-direction: column; gap: 1rem;">
            <span class="modal-section-label" style="margin-bottom: 0.5rem; display: block;">Partie 1 : Conception & Intégration</span>
            <p class="modal-desc" style="font-size:0.95rem; margin-top: 0; padding-top: 0; line-height: 1.6;">${data.part1.replace("<strong>Mise en place de l'infrastructure réseau (Phase 1) :</strong><br>", "").replace("<strong>Méthodologie d'Audit Offensif & Correctifs :</strong><br>", "").replace(/^(\s*|<br>)+/i, "").trim()}</p>
          </div>
          <div class="modal-right" style="display: flex; flex-direction: column; gap: 1rem;">
            <span class="modal-section-label" style="margin-bottom: 0.5rem; display: block;">Partie 2 : Modélisation & Étude technique</span>
            <p class="modal-desc" style="font-size:0.95rem; margin-top: 0; padding-top: 0; line-height: 1.6;">${data.part2.replace("<strong>Sécurisation & Durcissement (Phase 2) :</strong><br>", "").replace("<strong>Attaques simulées sur DVWA :</strong><br>", "").replace(/^(\s*|<br>)+/i, "").trim()}</p>
          </div>
        </div>
      </div>

      <!-- TAB 3: RESULTATS & CONFIGS -->
      <div class="modal-tab-panel" id="tab-results">
        ${projectId === 'sae-reseau-sec' ? `
        <!-- Custom 3-Phase Layout for SAE CYBER 401 -->
        <div style="padding: 2rem 3rem 3rem 3rem; display: flex; flex-direction: column; gap: 2.5rem;">
          
          <!-- PHASE 1: MISE EN PLACE -->
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 2rem;">
            <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.25rem;"><i class="fas fa-network-wired" style="margin-right: 8px;"></i> Phase 1 : Mise en place du réseau</h3>
            <p class="modal-desc" style="font-size: 0.95rem; margin-bottom: 1.5rem;">
              La première phase a consisté à concevoir et à déployer l'architecture réseau multi-sites dans Cisco Packet Tracer, à segmenter l'infrastructure locale par des VLANs (VLAN 10 DATA, VLAN 30 INTRANET, VLAN 99 ADMIN), à mettre en place la zone DMZ contenant les serveurs publics (DNS BIND9, serveur Web Apache en HTTPS, messagerie Postfix/Dovecot), et à configurer l'interconnexion sécurisée par un tunnel VPN IPsec.
            </p>
            
            <span class="modal-section-label" style="display: block; margin-bottom: 0.5rem;">Topologie et Configurations de la Phase 1</span>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE401/Structure_Reseau_Frain_Parre.png')">
                <img src="SAE401/Structure_Reseau_Frain_Parre.png" alt="Structure du réseau logique" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 8px; font-size: 0.75rem; color: #111; text-align: center; font-weight: 500; border-top: 1px solid var(--border-color);">Topologie logique générale</div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE401/image1.png')">
                <img src="SAE401/image1.png" alt="Configuration routeur" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 8px; font-size: 0.75rem; color: #111; text-align: center; font-weight: 500; border-top: 1px solid var(--border-color);">Architecture Packet Tracer</div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE401/image2.png')">
                <img src="SAE401/image2.png" alt="Interfaces et routage" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 8px; font-size: 0.75rem; color: #111; text-align: center; font-weight: 500; border-top: 1px solid var(--border-color);">Réseau local et sous-interfaces</div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <details class="config-details">
                <summary class="config-summary">
                  <span>Configuration du Tunnel VPN IPsec (Site Secondaire)</span>
                  <i class="fas fa-chevron-down toggle-icon" style="transition: transform 0.2s;"></i>
                </summary>
                <div class="cmd-box" style="max-height: 250px; overflow-y: auto; margin-top: 0; border: none; border-radius: 0;">
                  <code class="cmd-line">! Configuration de l'interface logique Tunnel10 pour le VPN IPsec<br>interface Tunnel10<br>&nbsp;ip address 172.16.0.2 255.255.0.0<br>&nbsp;tunnel source 203.0.113.13 (IP publique du routeur site secondaire)<br>&nbsp;tunnel mode ipsec ipv4<br>&nbsp;tunnel destination 203.0.113.11 (IP publique du routeur principal)<br>&nbsp;tunnel protection ipsec profile IPSECPROFILE<br>!<br>! Routage statique forçant le trafic inter-sites à emprunter le tunnel VPN IPsec<br>ip route 10.0.0.0 255.255.255.240 172.16.0.1 (DMZ)<br>ip route 192.168.0.0 255.255.0.0 172.16.0.1 (LAN principal)</code>
                </div>
              </details>
            </div>
          </div>

          <!-- PHASE 2: SÉCURISATION -->
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 2rem;">
            <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.25rem;"><i class="fas fa-shield-halved" style="margin-right: 8px;"></i> Phase 2 : Sécurisation et Durcissement</h3>
            <p class="modal-desc" style="font-size: 0.95rem; margin-bottom: 1.5rem;">
              La deuxième phase a consisté à implémenter les mécanismes de sécurisation logique sur les commutateurs et les routeurs afin d'empêcher les attaques courantes de couche 2 (saturation de table MAC, switch spoofing, usurpation de pont racine) et de restreindre les flux réseau et les accès d'administration aux seuls éléments légitimes.
            </p>
            
            <span class="modal-section-label" style="display: block; margin-bottom: 0.5rem;">Configurations et Justifications de la Phase 2</span>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <details class="config-details">
                <summary class="config-summary">
                  <span>Sécurisation de la couche 2 sur les Switchs (Port-Security & Spanning-Tree)</span>
                  <i class="fas fa-chevron-down toggle-icon" style="transition: transform 0.2s;"></i>
                </summary>
                <div class="cmd-box" style="max-height: 250px; overflow-y: auto; margin-top: 0; border: none; border-radius: 0;">
                  <code class="cmd-line">interface GigabitEthernet0/4<br>&nbsp;switchport mode access (force le port en mode terminal pour bloquer le switch spoofing)<br>&nbsp;switchport nonegotiate (désactive le protocole dynamique DTP pour empêcher l'établissement non autorisé de trunks)<br>&nbsp;switchport port-security maximum 2 (limite le port à 2 adresses MAC distinctes pour empêcher la saturation de table MAC)<br>&nbsp;switchport port-security (active le mécanisme de port-security)<br>&nbsp;switchport port-security violation restrict (bloque le trafic des machines non autorisées tout en notifiant l'administrateur sans couper le port)<br>&nbsp;switchport port-security mac-address sticky (enregistre automatiquement en dur les adresses MAC connectées)<br>&nbsp;spanning-tree portfast (accélère le passage du port à l'état de transfert)<br>&nbsp;spanning-tree bpduguard enable (désactive immédiatement le port s'il reçoit un paquet BPDU, contrant le root spoofing)</code>
                </div>
              </details>

              <details class="config-details">
                <summary class="config-summary">
                  <span>Filtrage d'Administration SSH Restreint (Routeur & Switchs)</span>
                  <i class="fas fa-chevron-down toggle-icon" style="transition: transform 0.2s;"></i>
                </summary>
                <div class="cmd-box" style="max-height: 250px; overflow-y: auto; margin-top: 0; border: none; border-radius: 0;">
                  <code class="cmd-line">! Définition de la liste de contrôle d'accès d'administration<br>ip access-list standard ACL-ADMIN-ONLY<br>&nbsp;permit 192.168.99.25 (autorise uniquement le poste d'administration de confiance)<br>&nbsp;deny any (bloque tout autre hôte du réseau)<br>!<br>! Application de la restriction sur les terminaux de contrôle virtuel (VTY)<br>line vty 0 4<br>&nbsp;access-class ACL-ADMIN-ONLY in (applique le filtrage ACL aux connexions entrantes)<br>&nbsp;exec-timeout 1 0 (déconnexion automatique de la session après 1 minute d'inactivité)<br>&nbsp;login local (demande une authentification locale sécurisée)<br>&nbsp;transport input ssh (interdit Telnet, autorise uniquement les connexions chiffrées SSH)</code>
                </div>
              </details>
            </div>
          </div>

          <!-- PHASE 3: ATTAQUE -->
          <div>
            <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.25rem;"><i class="fas fa-bug" style="margin-right: 8px;"></i> Phase 3 : Audit offensif et Attaque</h3>
            <p class="modal-desc" style="font-size: 0.95rem; margin-bottom: 1.5rem;">
              La dernière phase s'est déroulée sous la forme d'un pentest réciproque avec l'équipe adverse. L'objectif était d'identifier les vulnérabilités de l'infrastructure externe puis interne, d'éprouver la configuration face à des attaques réelles, et de gérer les accès selon <strong>les 3 niveaux de privilèges d'administration</strong> (SuperAdmin, Admin, Opérateur) basés sur le rapport d'audit.
            </p>
            
            <div style="background: var(--bg-tertiary); padding: 1.25rem; border-radius: var(--radius-md); border-left: 4px solid var(--accent); margin-bottom: 1.5rem;">
              <strong style="display:block; margin-bottom: 0.5rem; color:var(--text-primary);">Mise en œuvre des attaques :</strong>
              <ul style="margin-left: 1.25rem; font-size: 0.9rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--text-secondary);">
                <li><strong>Reconnaissance externe (Nmap, Dirb, Nikto) :</strong> Un scan Nmap complet des ports de l'infrastructure publique a révélé les services exposés (SSH port 22, SMTP port 25, HTTP port 80). Le script <code>smtp-enum-users</code> a permis d'interroger les commandes SMTP VRFY/EXPN pour identifier les adresses de messagerie des employés. Nikto a mis en évidence l'absence d'en-têtes HTTP de sécurité (Clickjacking) et Dirb a démasqué des répertoires cachés (comme <code>/server-status</code>).</li>
                <li><strong>Exploitation interne (Netdiscover & Hydra) :</strong> Après raccordement au VLAN DATA, l'outil Netdiscover a servi à cartographier les hôtes par balayages ARP. Les tentatives de brute-force SSH avec Hydra ont échoué en raison d'une erreur de compatibilité cryptographique. En effet, le routeur utilisait des algorithmes d'échange de clés obsolètes (<code>diffie-hellman-group1-sha1</code>) refusés par les versions récentes du client SSH de Kali Linux, illustrant une vulnérabilité de chiffrement nécessitant une mise à jour.</li>
              </ul>
            </div>

            <div style="background: var(--bg-tertiary); padding: 1.25rem; border-radius: var(--radius-md); border-left: 4px solid var(--accent); margin-bottom: 1.5rem;">
              <strong style="display:block; margin-bottom: 0.5rem; color:var(--text-primary);">Les 3 niveaux de privilèges d'administration :</strong>
              <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                Afin de segmenter la gestion et de limiter les risques en cas de compromission, l'administration repose sur trois rôles hiérarchisés :
                <br>• <strong>SuperAdmin (Privilège 15) :</strong> Accès total et illimité à la configuration complète des routeurs et commutateurs, modification des règles de filtrage (ACL), du chiffrement VPN et de la sécurité de couche 2.
                <br>• <strong>Admin (Privilège 10-14) :</strong> Capacité à diagnostiquer le réseau, modifier des configurations d'interfaces secondaires et gérer les configurations utilisateur courantes.
                <br>• <strong>Opérateur (Privilège 1-9 / Mode Lecture) :</strong> Droits de lecture seule (commandes de diagnostic <code>show</code>) pour vérifier l'état des liaisons et la table de routage, sans droit de modification de la structure ou de la sécurité.
              </p>
            </div>
            
            <span class="modal-section-label" style="display: block; margin-bottom: 0.5rem;">Preuves et captures de l'Audit Offensif</span>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE401/nmap_mail.png')">
                <img src="SAE401/nmap_mail.png" alt="Énumération SMTP et Scan Nmap" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3;">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Nmap + SMTP Enum Users</strong>
                  Énumération des comptes de messagerie via les commandes SMTP VRFY/EXPN.
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE401/hydra.png')">
                <img src="SAE401/hydra.png" alt="Attaque de force brute SSH avec Hydra" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3;">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Hydra (Brute-Force SSH)</strong>
                  Tentative de brute-force SSH avortée à cause de clés cryptographiques obsolètes sur Cisco IOS.
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE401/nmap_nantes.png')">
                <img src="SAE401/nmap_nantes.png" alt="Scan Nmap sur le réseau de Nantes" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3;">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Nmap (Scan de Réseau)</strong>
                  Reconnaissance globale et scan de ports externes pour détecter les services publics ouverts.
                </div>
              </div>
            </div>
          </div>

        </div>
        ` : projectId === 'sae-cyber-audit' ? `
        <!-- Custom 3-Attacks Layout for SAE3.CYBER.04 -->
        <div style="padding: 2rem 3rem 3rem 3rem; display: flex; flex-direction: column; gap: 2.5rem;">
          
          <!-- ATTACK 1: BRUTE FORCE -->
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 2rem;">
            <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.25rem;"><i class="fas fa-key" style="margin-right: 8px;"></i> Attaque 1 : Brute Force</h3>
            <p class="modal-desc" style="font-size: 0.95rem; margin-bottom: 1.5rem;">
              L'attaque par brute-force consiste à tester systématiquement une liste de mots de passe (dictionnaire) sur un formulaire d'authentification. L'attaque a été automatisée à l'aide de l'outil <strong>Hydra</strong> en ciblant le formulaire d'authentification de DVWA qui transmet les paramètres via la méthode GET dans l'URL.
              <br><br>
              <strong>Hypothèse de correction :</strong> Ajout d'un délai obligatoire (sleep) de 2 secondes après chaque échec de connexion pour ralentir les outils automatisés, implémentation d'un verrouillage temporaire du compte (account lockout) après 5 tentatives infructueuses, et contrainte sur la complexité et longueur des mots de passe.
            </p>
            
            <span class="modal-section-label" style="display: block; margin-bottom: 0.5rem;">Captures commentées de la force brute Hydra</span>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/hydra_att.png')">
                <img src="SAE3Cyber04/hydra_att.png" alt="Préparation de l'attaque Hydra" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Hydra - Paramétrage</strong>
                  Configuration de la commande Hydra avec les variables d'URL et cookies de session.
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/hydra_rslt.png')">
                <img src="SAE3Cyber04/hydra_rslt.png" alt="Lancement et retour de l'attaque" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Hydra - Exécution</strong>
                  Traitement et analyse en direct des requêtes HTTP GET par Hydra.
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/succes_hydra.png')">
                <img src="SAE3Cyber04/succes_hydra.png" alt="Identification réussie des accès" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Hydra - Succès</strong>
                  Découverte de l'accès valide pour l'utilisateur admin (mot de passe : password).
                </div>
              </div>
            </div>
          </div>

          <!-- ATTACK 2: SQL INJECTION -->
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 2rem;">
            <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.25rem;"><i class="fas fa-database" style="margin-right: 8px;"></i> Attaque 2 : SQL Injection</h3>
            <p class="modal-desc" style="font-size: 0.95rem; margin-bottom: 1.5rem;">
              La faille d'injection SQL permet de manipuler les requêtes SQL envoyées à la base de données afin de contourner l'authentification ou d'extraire des informations sensibles. En injectant le payload <code>' OR 1=1 #</code> dans le champ ID, la condition devient toujours vraie, forçant l'application à lister tous les utilisateurs. Nous avons ensuite combiné l'opérateur <code>UNION</code> pour lister les tables de la base de données <i>dvwa</i>, puis récupérer les colonnes <i>user</i> et <i>password</i> contenant les hashs MD5 des mots de passe.
              <br><br>
              <strong>Hypothèse de correction :</strong> Utilisation systématique de requêtes préparées PDO en PHP. En liant les paramètres via <code>bindParam</code>, le serveur SQL interprète l'entrée utilisateur strictement comme du texte (littéral) et non comme du code SQL exécutable.
            </p>
            
            <span class="modal-section-label" style="display: block; margin-bottom: 0.5rem;">Captures commentées de l'injection SQL UNION</span>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/sql_req.png')">
                <img src="SAE3Cyber04/sql_req.png" alt="Test d'injection SQL" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Injection - Test ID</strong>
                  Saisie d'un identifiant normal (ID 1) pour valider le comportement classique du formulaire.
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/sql_req2.png')">
                <img src="SAE3Cyber04/sql_req2.png" alt="Erreur SQL retournée" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Injection - Erreur</strong>
                  L'injection d'un caractère spécial (simple quote ') génère une erreur, confirmant la vulnérabilité.
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/sql_req3.png')">
                <img src="SAE3Cyber04/sql_req3.png" alt="Extraction nom de base" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Injection - Base de Données</strong>
                  Usage de UNION SELECT pour identifier le nom de la base de données active (dvwa).
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/sql_req4.png')">
                <img src="SAE3Cyber04/sql_req4.png" alt="Extraction des tables" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Injection - Tables</strong>
                  Interrogation du catalogue d'information pour lister les tables de la base (découverte de la table users).
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/sql_req5.png')">
                <img src="SAE3Cyber04/sql_req5.png" alt="Extraction des colonnes" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Injection - Colonnes</strong>
                  Extraction des noms de champs (colonnes user et password) de la table users.
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/sql_req6.png')">
                <img src="SAE3Cyber04/sql_req6.png" alt="Extraction des hashs" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Injection - Données finalisées</strong>
                  Extraction réussie des identifiants et des mots de passe encodés en MD5.
                </div>
              </div>
            </div>
          </div>

          <!-- ATTACK 3: INSECURE CAPTCHA -->
          <div>
            <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.25rem;"><i class="fas fa-shield" style="margin-right: 8px;"></i> Attaque 3 : Insecure CAPTCHA</h3>
            <p class="modal-desc" style="font-size: 0.95rem; margin-bottom: 1.5rem;">
              La faille de contournement de CAPTCHA se produit lorsque l'application valide le CAPTCHA dans une requête initiale séparée, mais effectue l'action finale (le changement de mot de passe) dans une seconde requête sans revérifier que le CAPTCHA a bien été résolu. À l'aide de <strong>Burp Suite</strong>, nous avons intercepté la requête POST d'étape 1 (<code>step=1</code>) et l'avons réécrite en modifiant la variable d'étape à 2 (<code>step=2</code>) tout en retirant le paramètre de validation du CAPTCHA, nous permettant ainsi de changer le mot de passe arbitrairement sans aucune vérification humaine.
              <br><br>
              <strong>Hypothèse de correction :</strong> Le serveur doit valider la clé de captcha directement auprès de l'API de validation (ex. Google reCAPTCHA) de manière synchrone lors de la soumission finale de l'action, ou utiliser un jeton à usage unique (nonce) généré à la résolution du CAPTCHA et détruit dès sa première vérification côté serveur.
            </p>
            
            <span class="modal-section-label" style="display: block; margin-bottom: 0.5rem;">Captures de l'interception et contournement sous Burp Suite</span>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/modf_mdp.png')">
                <img src="SAE3Cyber04/modf_mdp.png" alt="Formulaire Captcha" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Formulaire de changement</strong>
                  Interface web DVWA liant le changement de mot de passe à la validation du CAPTCHA.
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/burp_ana.png')">
                <img src="SAE3Cyber04/burp_ana.png" alt="Analyse Burp Suite" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Burp Suite - Interception</strong>
                  Mise en écoute du proxy d'interception Burp Suite pour intercepter les paquets HTTP.
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/burp_POST.png')">
                <img src="SAE3Cyber04/burp_POST.png" alt="Requête POST" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Burp - Requête POST</strong>
                  Lecture des paramètres de la requête brute contenant step=1 et recaptcha-response.
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/burp_step1.png')">
                <img src="SAE3Cyber04/burp_step1.png" alt="Étape 1" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Burp - Étape 1 standard</strong>
                  Analyse de la structure de l'étape 1 qui transmet la résolution du CAPTCHA.
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/burp_step2.png')">
                <img src="SAE3Cyber04/burp_step2.png" alt="Étape 2 forcée" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Burp - Étape 2 forcée</strong>
                  Modification manuelle en direct pour soumettre la requête en step=2 sans reCAPTCHA.
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE3Cyber04/test_creden.png')">
                <img src="SAE3Cyber04/test_creden.png" alt="Validation d'accès" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Validation Credentials</strong>
                  Connexion réussie avec le nouveau mot de passe (toto) modifié sans résoudre de CAPTCHA.
                </div>
              </div>
            </div>
          </div>

        </div>
        ` : projectId === 'sae-telecom-radio' ? `
        <!-- Custom Layout for SAE301 Telecom Radio -->
        <div style="padding: 2rem 3rem 3rem 3rem; display: flex; flex-direction: column; gap: 2.5rem;">
          
          <!-- PART 1: MEASUREMENTS & LABORATORY -->
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 2rem;">
            <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.25rem;"><i class="fas fa-tower-broadcast" style="margin-right: 8px;"></i> Partie 1 : Mesures de modulation et d'ondes en laboratoire</h3>
            <p class="modal-desc" style="font-size: 0.95rem; margin-bottom: 1.5rem;">
              En laboratoire, nous avons mis en œuvre la chaîne de réception radio complète à l'aide d'antennes physiques (filaire, fouet et Yagi) et d'un analyseur de spectre de précision. Nous avons visualisé les modulations AM/FM et mesuré l'amplitude des signaux reçus.
              <br><br>
              L'analyse spectrale du signal FM de l'émetteur Skyrock (fréquence 95.4 MHz) a permis de relever une puissance reçue de <strong>-53.29 dBm</strong>, constituant notre valeur expérimentale de référence pour le calcul du bilan de liaison.
            </p>
            
            <span class="modal-section-label" style="display: block; margin-bottom: 0.5rem;">Preuves et captures des mesures en laboratoire</span>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE301 Systeme de communication radio/anal_FM.png')">
                <img src="SAE301 Systeme de communication radio/anal_FM.png" alt="Analyse spectrale Skyrock FM" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Analyseur de Spectre FM</strong>
                  Visualisation du signal de 95.4 MHz avec mesure précise de puissance et bruit.
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE301 Systeme de communication radio/ch_trans_radio.png')">
                <img src="SAE301 Systeme de communication radio/ch_trans_radio.png" alt="Chaîne de transmission radio" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Banc d'Essai Radio</strong>
                  Chaîne de réception et démodulateur de signaux analogiques AM/FM.
                </div>
              </div>
            </div>
          </div>
          
          <!-- PART 2: MODELING & LINK BUDGET -->
          <div>
            <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.25rem;"><i class="fas fa-calculator" style="margin-right: 8px;"></i> Partie 2 : Modélisation d'antennes et Bilan de liaison</h3>
            <p class="modal-desc" style="font-size: 0.95rem; margin-bottom: 1.5rem;">
              Nous avons simulé numériquement les diagrammes de rayonnement 2D/3D et l'impédance de nos antennes sous <strong>MMANA-GAL Basic</strong>, mettant en évidence l'importance d'adapter l'antenne à la fréquence cible pour éviter les pertes de directivité.
            </p>
            
            <!-- Link Budget box -->
            <div style="background: var(--bg-tertiary); padding: 1.25rem; border-radius: var(--radius-md); border-left: 4px solid var(--accent); margin-bottom: 1.5rem; box-sizing: border-box;">
              <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary); font-weight: 700; font-size: 0.95rem; text-transform: uppercase;"><i class="fas fa-square-root-variable" style="margin-right: 6px;"></i> Calcul du Bilan de Liaison</h4>
              <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
                • <strong>Perte de propagation en espace libre (α) :</strong> Pour une distance d = 650 m à la fréquence f = 96.4 MHz (longueur d'onde λ ≈ 3.11 m) :
                <br>&nbsp;&nbsp;&nbsp;<code>α = 20 log10(4πd / λ) ≈ 68.38 dB</code>
                <br>• <strong>Puissance d'émission calculée (Pe) :</strong> Équation de bilan : <code>Pe = Pr - Ge + α - Gr</code>
                <br>&nbsp;&nbsp;&nbsp;Avec Pr = -18.28 dBm (puissance reçue), Ge = 3 dBi (gain émetteur), Gr = 2.6 dBi (gain récepteur) :
                <br>&nbsp;&nbsp;&nbsp;<code>Pe = -18.28 - 3 + 68.38 - 2.6 = 44.50 dBm</code> (soit <strong>28.18 Watts</strong>).
              </p>
            </div>
            
            <span class="modal-section-label" style="display: block; margin-bottom: 0.5rem;">Modélisation MMANA-GAL et adaptation</span>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE301 Systeme de communication radio/ant_pas_adapt.png')">
                <img src="SAE301 Systeme de communication radio/ant_pas_adapt.png" alt="Rayonnement non adapté" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Rayonnement Non Adapté</strong>
                  Diagramme de rayonnement détérioré à 162 kHz (le gain chute à -23 dBi).
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE301 Systeme de communication radio/ant_yagi_uda.png')">
                <img src="SAE301 Systeme de communication radio/ant_yagi_uda.png" alt="Rayonnement Yagi-Uda" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Rayonnement Adapté Yagi</strong>
                  Diagramme de rayonnement directif simulé à 95.4 MHz (gain de 5.62 dBi, angle de 48°).
                </div>
              </div>
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: #fff; cursor: zoom-in; display: flex; flex-direction: column;" onclick="window.triggerLightbox('SAE301 Systeme de communication radio/ant_yagi.png')">
                <img src="SAE301 Systeme de communication radio/ant_yagi.png" alt="Antenne Yagi physique" style="width:100%; height:120px; object-fit:contain; background-color:#ffffff; display:block;">
                <div style="padding: 10px; font-size: 0.75rem; color: #111; font-weight: 500; line-height: 1.3; border-top: 1px solid var(--border-color);">
                  <strong style="display: block; color: var(--accent); margin-bottom: 2px;">Antenne Yagi Physique</strong>
                  Antenne de test directive Yagi-Uda mesurée en conditions réelles de laboratoire.
                </div>
              </div>
            </div>
          </div>
          
        </div>
        ` : `
        <!-- Section Fichiers de Configuration en haut (Pleine largeur) -->
        ${showConfigs ? `
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
        `}
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

    let mediaHTML = '';
    if (data.icon.includes('/') || data.icon.includes('.')) {
      mediaHTML = `<div style="height:100%; width:100%; display:flex; align-items:center; justify-content:center;"><img src="${data.icon}" style="width: 100%; height: 100%; object-fit: contain; padding: 1.5rem; box-sizing: border-box; filter: none; opacity: 1;"></div>`;
    } else {
      mediaHTML = `<div style="height:100%; min-height:280px; display:flex; align-items:center; justify-content:center; color:#111111;"><i class="${data.icon} fa-8x" style="font-size: 8rem;"></i></div>`;
    }

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
