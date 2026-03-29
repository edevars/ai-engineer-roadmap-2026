import { Shield, Network, Server, Database, Building2 } from "lucide-react";

const CLOUD_AWS_ICON_MAP = {
  "fundamentos-aws":             Shield,
  "networking-security":         Network,
  "compute-containers":          Server,
  "data-storage":                Database,
  "arquitectura-confiabilidad":  Building2,
};

const CloudAwsAreaIcon = ({ id, size = 15, style = {} }) => {
  const Icon = CLOUD_AWS_ICON_MAP[id];
  return Icon ? <Icon size={size} style={style} /> : null;
};

const cloudAwsData = [
  /* ═══════════════════════════════════════════════════════════
     1.  FUNDAMENTOS AWS
     ═══════════════════════════════════════════════════════════ */
  {
    id: "fundamentos-aws",
    icon: "🛡️",
    color: "#FF9500",
    title: "Fundamentos AWS",
    subtitle: "De usuario casual a profesional certificado en servicios core",
    period: "3 meses",
    periodLabel:
      "Los primeros 3 meses construyen el vocabulario y la mentalidad cloud-native. Sin esta base, los servicios avanzados son recetas sin comprensión — entenderás el 'qué' pero no el 'por qué'.",
    phases: [
      /* ── Mes 1 ── */
      {
        label: "Mes 1",
        title: "Identidad, Redes y Compute Esencial",
        deliverable:
          "Cuenta AWS con organización básica, VPC custom con subnets públicas/privadas, y una instancia EC2 accesible vía ALB.",
        metric:
          "Puedes explicar sin notas la diferencia entre IAM Users y Roles, cómo fluye el tráfico en una VPC, y cuándo usar ALB vs NLB.",
        resources: [
          { name: "AWS Certified Solutions Architect — Stephane Maarek (Udemy)", url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/" },
          { name: "Adrian Cantrill — SAA-C03 Course", url: "https://learn.cantrill.io/p/aws-certified-solutions-architect-associate-saa-c03" },
          { name: "AWS IAM Documentation", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html", free: true },
          { name: "AWS VPC Documentation", url: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html", free: true },
        ],
        objectives: [
          {
            topic: "IAM deep dive: usuarios, roles, policies y least privilege",
            why: "IAM es el sistema nervioso de seguridad en AWS. Cada llamada API pasa por IAM. Entender la diferencia entre Identity-based y Resource-based policies, cómo funcionan los trust relationships de los roles, y por qué nunca debes usar el root account — es la base de toda arquitectura segura. Un error en IAM es un breach en producción.",
            resource: { name: "AWS IAM User Guide — Policies and Permissions", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html", free: true },
            miniDeliverable: "Crear una política IAM custom que permita a un rol de EC2 leer solo un bucket S3 específico y escribir logs en CloudWatch. Documentar cada statement del JSON con comentarios explicando por qué.",
          },
          {
            topic: "VPC desde cero: subnets, route tables, Internet Gateway, NAT Gateway",
            why: "VPC es la red privada virtual donde vive toda tu infraestructura AWS. Sin entender subnets públicas vs privadas, route tables, y cómo un NAT Gateway permite a instancias privadas acceder a internet sin ser accesibles desde afuera, no puedes diseñar arquitecturas seguras. El 90% de los problemas de conectividad en AWS son errores de VPC.",
            resource: { name: "AWS VPC — Getting Started", url: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-getting-started.html", free: true },
            miniDeliverable: "Crear una VPC con 2 subnets públicas y 2 privadas en 2 AZs, con Internet Gateway, NAT Gateway, y route tables correctamente configurados. Diagramar el flujo de tráfico inbound y outbound.",
          },
          {
            topic: "EC2 fundamentals: instance types, AMIs, user data, placement groups",
            why: "EC2 sigue siendo el servicio de compute más usado en AWS. Entender las familias de instancias (general purpose, compute optimized, memory optimized), cómo funcionan las AMIs para reproducibilidad, y user data para bootstrap — es esencial antes de pasar a containers o serverless. Placement groups afectan latencia y disponibilidad de formas que no son intuitivas.",
            resource: { name: "AWS EC2 Instance Types", url: "https://aws.amazon.com/ec2/instance-types/", free: true },
            miniDeliverable: "Lanzar 3 instancias EC2 de diferentes familias, instalar una aplicación via user data, y documentar las diferencias de performance entre t3.micro, c6i.large y r6i.large para un benchmark simple.",
          },
          {
            topic: "Security Groups vs NACLs: stateful vs stateless en capas",
            why: "Security Groups son stateful (si permites entrada, la respuesta sale automáticamente), NACLs son stateless (debes permitir explícitamente entrada Y salida). Esta diferencia parece simple pero causa la mayoría de problemas de conectividad en AWS. Entender cómo se evalúan las reglas en cada capa — y que los Security Groups operan a nivel de ENI mientras NACLs operan a nivel de subnet — es crítico para troubleshooting.",
            resource: { name: "AWS — Security Groups vs NACLs", url: "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html", free: true },
            miniDeliverable: "Configurar un escenario donde una NACL bloquea tráfico que un Security Group permite. Documentar el flujo de evaluación de reglas y por qué el orden importa en NACLs pero no en Security Groups.",
          },
          {
            topic: "Elastic Load Balancing: ALB vs NLB, target groups, health checks",
            why: "ALB opera en capa 7 (HTTP/HTTPS) y permite routing por path, host header, y query strings — ideal para microservicios. NLB opera en capa 4 (TCP/UDP) con latencia ultra-baja y IPs estáticas — necesario para protocolos no-HTTP. Elegir mal el load balancer afecta performance, costo y capacidades de routing. Los health checks mal configurados son la causa #1 de instancias saludables marcadas como unhealthy.",
            resource: { name: "AWS — Elastic Load Balancing", url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html", free: true },
            miniDeliverable: "Desplegar un ALB con path-based routing que dirija /api a un target group y /static a otro. Configurar health checks custom y documentar el comportamiento cuando un target falla.",
          },
        ],
      },
      /* ── Mes 2 ── */
      {
        label: "Mes 2",
        title: "Storage, Bases de Datos y Distribución Global",
        deliverable:
          "Infraestructura con S3 versionado, RDS Multi-AZ, y CloudFront sirviendo assets estáticos con cache invalidation automatizado.",
        metric:
          "Puedes elegir entre S3, EBS, EFS sin dudar según el caso de uso, y explicar cuándo Multi-AZ no es suficiente y necesitas read replicas.",
        resources: [
          { name: "AWS S3 Developer Guide", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html", free: true },
          { name: "AWS RDS User Guide", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html", free: true },
          { name: "AWS CloudFront Developer Guide", url: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html", free: true },
        ],
        objectives: [
          {
            topic: "S3 deep dive: storage classes, lifecycle policies, versioning, replication",
            why: "S3 es el servicio de storage más versátil de AWS pero tiene más de 6 storage classes con precios y latencias muy diferentes. Lifecycle policies automatizan la transición entre classes (ej: Standard → IA → Glacier después de 90 días). Versioning previene deletes accidentales. Cross-Region Replication es fundamental para DR. Configurar mal cualquiera de estos puede multiplicar costos x10.",
            resource: { name: "AWS S3 — Storage Classes", url: "https://aws.amazon.com/s3/storage-classes/", free: true },
            miniDeliverable: "Crear un bucket S3 con versioning habilitado, lifecycle policy que mueva objetos a IA después de 30 días y a Glacier después de 90, y CRR a otra región. Calcular el ahorro estimado vs mantener todo en Standard.",
          },
          {
            topic: "EBS vs EFS vs FSx: cuándo usar cada tipo de storage",
            why: "EBS es block storage para una sola instancia EC2 (como un disco duro), EFS es file storage compartido entre múltiples instancias (NFS managed), y FSx soporta protocolos enterprise (Windows/Lustre). La diferencia de performance es dramática: EBS io2 ofrece hasta 64,000 IOPS, EFS escala automáticamente, FSx for Lustre alcanza sub-milisegundo para HPC. Elegir mal impacta directamente performance y costo.",
            resource: { name: "AWS — Storage Options Overview", url: "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/storage-services.html", free: true },
            miniDeliverable: "Montar EFS en dos instancias EC2 en diferentes AZs, escribir y leer archivos desde ambas simultáneamente. Comparar la latencia de lectura vs un volumen EBS gp3 local. Documentar cuándo cada opción es correcta.",
          },
          {
            topic: "RDS fundamentals: Multi-AZ, read replicas, parameter groups, backups",
            why: "RDS elimina el overhead operativo de bases de datos, pero entender Multi-AZ (failover automático, no para lectura) vs Read Replicas (escalamiento de lectura, eventual consistency) es crítico para arquitectura. Parameter groups controlan configuración del motor (ej: max_connections en PostgreSQL). Automated backups con point-in-time recovery pueden salvar tu negocio — pero solo si están configurados correctamente.",
            resource: { name: "AWS RDS — Multi-AZ Deployments", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html", free: true },
            miniDeliverable: "Desplegar una instancia RDS PostgreSQL con Multi-AZ y una Read Replica. Simular un failover, medir el downtime, y verificar que la Read Replica sigue sirviendo lecturas durante el failover.",
          },
          {
            topic: "CloudFront + Route 53: distribución global y DNS routing policies",
            why: "CloudFront es la CDN de AWS con 400+ edge locations. Route 53 es DNS con routing policies que van mucho más allá de A records: latency-based routing envía al usuario al endpoint más cercano, weighted routing permite blue/green deploys, failover routing detecta health check failures y redirige automáticamente. Juntos forman la capa de entrada global de cualquier arquitectura seria.",
            resource: { name: "AWS CloudFront — Getting Started", url: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.html", free: true },
            miniDeliverable: "Configurar CloudFront con un origen S3 para assets estáticos y un origen ALB para la API. Implementar cache behaviors diferenciados y una invalidation automática vía CLI después de cada deploy.",
          },
          {
            topic: "AWS CLI y CloudFormation basics: infraestructura como código desde el día 1",
            why: "Hacer todo desde la consola es aprender a no reproducir. AWS CLI te da control programático de cada servicio. CloudFormation declara infraestructura como código (IaC) — un template YAML/JSON que crea, actualiza y destruye recursos de forma predecible. Empezar con IaC desde el mes 1 construye el hábito más valioso de un cloud engineer: toda infraestructura debe ser reproducible.",
            resource: { name: "AWS CloudFormation — Getting Started", url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/GettingStarted.html", free: true },
            miniDeliverable: "Escribir un template CloudFormation que cree la VPC + subnets + ALB + EC2 del mes anterior. Hacer deploy, destruir, y re-deploy para demostrar reproducibilidad. Documentar los parámetros y outputs del stack.",
          },
        ],
      },
      /* ── Mes 3 ── */
      {
        label: "Mes 3",
        title: "Monitoreo, Auto Scaling y Primer Proyecto Integrador",
        deliverable:
          "App web 3-tier desplegada con VPC, ALB, Auto Scaling Group, RDS, S3, CloudFront, con dashboard de CloudWatch y alarmas configuradas.",
        metric:
          "Puedes diseñar y desplegar una arquitectura 3-tier completa desde cero, explicar cada componente y justificar las decisiones de diseño.",
        resources: [
          { name: "AWS CloudWatch User Guide", url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html", free: true },
          { name: "AWS Auto Scaling User Guide", url: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html", free: true },
          { name: "AWS Well-Architected Labs", url: "https://www.wellarchitectedlabs.com/", free: true },
        ],
        objectives: [
          {
            topic: "CloudWatch: métricas, alarmas, logs y dashboards",
            why: "CloudWatch es el centro de observabilidad de AWS. Métricas custom te permiten monitorear lo que importa a tu negocio, no solo lo que AWS reporta por defecto. Las alarmas con acciones automáticas (ej: escalar, enviar SNS, ejecutar Lambda) son la diferencia entre detectar un problema a las 3am o que tu cliente lo reporte. Los Logs Insights permiten queries sobre logs distribuidos sin necesidad de ELK.",
            resource: { name: "AWS CloudWatch — Getting Started", url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/GettingStarted.html", free: true },
            miniDeliverable: "Crear un dashboard de CloudWatch con métricas de EC2, ALB y RDS. Configurar una alarma que envíe notificación SNS cuando el CPU de cualquier instancia supere 80% por 5 minutos. Crear una métrica custom desde la app.",
          },
          {
            topic: "Auto Scaling Groups: scaling policies, launch templates, predictive scaling",
            why: "Auto Scaling es lo que hace que la nube sea elástica. Target tracking policies mantienen una métrica (ej: CPU al 60%) ajustando capacidad automáticamente. Step scaling permite respuestas diferenciadas a diferentes umbrales. Predictive scaling usa ML para anticipar patrones de carga. Launch templates definen la configuración exacta de cada instancia nueva — versionar templates es esencial para rollbacks.",
            resource: { name: "AWS — Auto Scaling Groups", url: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html", free: true },
            miniDeliverable: "Crear un ASG con target tracking (CPU 60%), mínimo 2, máximo 6 instancias. Simular carga con stress tool, observar el scale-out, y documentar el tiempo desde que la alarma se dispara hasta que la nueva instancia pasa el health check.",
          },
          {
            topic: "Systems Manager: Parameter Store, Session Manager, Patch Manager",
            why: "Systems Manager reemplaza la necesidad de SSH directo a instancias (Session Manager con auditoría), gestión centralizada de configuración (Parameter Store como alternativa gratuita a Secrets Manager para configs no-sensibles), y patching automatizado. En entornos enterprise, SSM es obligatorio — elimina bastion hosts, centraliza operaciones, y genera audit trail de cada acción.",
            resource: { name: "AWS Systems Manager — User Guide", url: "https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html", free: true },
            miniDeliverable: "Configurar Session Manager para acceder a instancias EC2 sin SSH ni Security Group port 22. Almacenar la connection string de RDS en Parameter Store y leerla desde la instancia EC2 vía IAM role.",
          },
          {
            topic: "Proyecto integrador: app web 3-tier con VPC, ALB, ASG, RDS, S3 y CloudFront",
            why: "Este proyecto integra todo lo aprendido en los 3 meses. Una arquitectura 3-tier (presentación → lógica → datos) desplegada con todos los servicios core demuestra que entiendes cómo interactúan VPC, compute, storage, base de datos, CDN y monitoreo. Es el portfolio piece más valioso de este primer trimestre y la base sobre la que construirás las áreas siguientes.",
            resource: { name: "AWS Well-Architected Labs — Reliability", url: "https://www.wellarchitectedlabs.com/reliability/", free: true },
            miniDeliverable: "Desplegar una app web completa: CloudFront → ALB → ASG (EC2) → RDS, con S3 para assets, CloudWatch para monitoreo, y todo definido en CloudFormation. Documentar el diagrama de arquitectura con justificación de cada componente.",
          },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════
     2.  NETWORKING & SECURITY
     ═══════════════════════════════════════════════════════════ */
  {
    id: "networking-security",
    icon: "🔒",
    color: "#00E5A0",
    title: "Networking & Security",
    subtitle: "Redes avanzadas y postura de seguridad a nivel enterprise",
    period: "3 meses",
    periodLabel:
      "Networking es la columna vertebral invisible de toda arquitectura cloud. Security no es un feature — es la postura que hace la diferencia entre un sistema en producción y un titular de data breach.",
    phases: [
      /* ── Mes 1 ── */
      {
        label: "Mes 1",
        title: "Networking Avanzado",
        deliverable:
          "Topología multi-VPC con Transit Gateway, VPN Site-to-Site simulada, y VPC Endpoints configurados para S3 y DynamoDB.",
        metric:
          "Puedes diseñar una red multi-cuenta con conectividad híbrida y explicar el flujo de paquetes entre on-premises y AWS.",
        resources: [
          { name: "AWS Advanced Networking — Specialty Guide", url: "https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/introduction.html", free: true },
          { name: "Adrian Cantrill — Advanced Networking", url: "https://learn.cantrill.io/" },
          { name: "AWS Networking & Content Delivery Blog", url: "https://aws.amazon.com/blogs/networking-and-content-delivery/", free: true },
        ],
        objectives: [
          {
            topic: "VPC Peering y Transit Gateway: conectividad multi-VPC y multi-cuenta",
            why: "VPC Peering es punto-a-punto y no transitivo — con 10 VPCs necesitas 45 peering connections. Transit Gateway actúa como hub central: una connection por VPC, routing centralizado, y soporte para miles de VPCs. En organizaciones con múltiples cuentas AWS, Transit Gateway es la diferencia entre una red manejable y un espagueti de peerings imposible de auditar.",
            resource: { name: "AWS Transit Gateway — Guide", url: "https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html", free: true },
            miniDeliverable: "Crear 3 VPCs conectadas vía Transit Gateway con route tables que permitan comunicación selectiva (VPC-A habla con VPC-B y VPC-C, pero VPC-B no habla con VPC-C). Documentar las route tables y diagramar el flujo.",
          },
          {
            topic: "VPN Site-to-Site y AWS Direct Connect: conectividad híbrida",
            why: "Site-to-Site VPN va sobre internet público con IPSec encryption — setup rápido, costo bajo, pero latencia variable. Direct Connect es una conexión física dedicada a AWS — latencia consistente, throughput alto, pero requiere proveedor y semanas de setup. La mayoría de empresas usan VPN como backup de Direct Connect. Entender cuándo cada opción es correcta es pregunta garantizada en el examen SA Pro.",
            resource: { name: "AWS — VPN Connections", url: "https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html", free: true },
            miniDeliverable: "Configurar una VPN Site-to-Site entre una VPC y un customer gateway simulado (EC2 con strongSwan o un servicio VPN). Verificar conectividad y documentar el proceso de troubleshooting de los tunnels.",
          },
          {
            topic: "VPC Endpoints: Gateway y Interface para acceso privado a servicios AWS",
            why: "Sin VPC Endpoints, el tráfico de una instancia en subnet privada a S3 sale a internet vía NAT Gateway — costoso y lento. Gateway Endpoints (S3, DynamoDB) son gratuitos y redirigen tráfico dentro de la red AWS. Interface Endpoints (PrivateLink) crean ENIs en tu VPC para acceder a 100+ servicios AWS de forma privada. En entornos regulados, todo tráfico debe ser privado — VPC Endpoints son obligatorios.",
            resource: { name: "AWS — VPC Endpoints", url: "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html", free: true },
            miniDeliverable: "Configurar un Gateway Endpoint para S3 y un Interface Endpoint para SSM. Demostrar que una instancia en subnet privada sin NAT Gateway puede acceder a ambos servicios. Calcular el ahorro en costos de NAT Gateway.",
          },
          {
            topic: "Advanced Route 53: failover, geolocation y latency-based routing",
            why: "Route 53 es mucho más que DNS. Failover routing con health checks crea automatic disaster recovery. Geolocation routing cumple con data residency requirements (ej: tráfico europeo solo va a eu-west). Latency-based routing envía a los usuarios al endpoint con menor latencia. Multivalue answer routing distribuye tráfico entre múltiples recursos saludables. Dominar estas políticas es core para arquitecturas globally distributed.",
            resource: { name: "AWS Route 53 — Routing Policies", url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html", free: true },
            miniDeliverable: "Configurar un dominio con failover routing entre dos regiones (primary y secondary), health checks que detecten fallos en el ALB primary, y automatic DNS failover. Documentar el TTL y el tiempo real de failover.",
          },
          {
            topic: "AWS Network Firewall y WAF: protección perimetral",
            why: "WAF protege aplicaciones web contra OWASP Top 10 (SQL injection, XSS) a nivel de ALB/CloudFront con reglas gestionadas y custom. Network Firewall opera a nivel de VPC con inspección profunda de paquetes, filtrado por dominio, y detección de intrusiones. Juntos forman defense-in-depth: WAF protege la capa de aplicación, Network Firewall protege la capa de red. Sin ambos, la seguridad tiene puntos ciegos.",
            resource: { name: "AWS WAF — Developer Guide", url: "https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html", free: true },
            miniDeliverable: "Configurar WAF en un ALB con reglas managed (AWSManagedRulesCommonRuleSet) y una regla custom que bloquee requests con un header específico. Probar con curl y documentar las reglas evaluadas y las acciones tomadas.",
          },
        ],
      },
      /* ── Mes 2 ── */
      {
        label: "Mes 2",
        title: "Seguridad en Profundidad",
        deliverable:
          "Arquitectura multi-cuenta con SCPs, encryption at rest/transit, GuardDuty habilitado, y Secrets Manager integrado con una aplicación.",
        metric:
          "Puedes diseñar una postura de seguridad defense-in-depth para una organización enterprise y explicar cada capa de protección.",
        resources: [
          { name: "AWS Security Best Practices (Whitepaper)", url: "https://docs.aws.amazon.com/whitepapers/latest/aws-security-best-practices/welcome.html", free: true },
          { name: "AWS Security Blog", url: "https://aws.amazon.com/blogs/security/", free: true },
          { name: "Tutorials Dojo — IAM Cheat Sheet", url: "https://tutorialsdojo.com/aws-identity-and-access-management-iam/", free: true },
        ],
        objectives: [
          {
            topic: "AWS Organizations y SCPs: governance multi-cuenta",
            why: "AWS Organizations permite gestionar múltiples cuentas desde una cuenta de management. Service Control Policies (SCPs) establecen guardrails: puedes prohibir que cualquier cuenta lance instancias fuera de ciertas regiones, o que deshabilite CloudTrail. Las SCPs no dan permisos — ponen límites máximos. En enterprise, una sola cuenta AWS es un anti-pattern; Organizations con SCPs es el estándar.",
            resource: { name: "AWS Organizations — User Guide", url: "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html", free: true },
            miniDeliverable: "Crear una organización con 2 OUs (Production y Development), aplicar una SCP que restrinja el uso de servicios a 3 regiones específicas, y verificar que una cuenta en Development no puede lanzar recursos en regiones prohibidas.",
          },
          {
            topic: "KMS y CloudHSM: encryption at rest y en tránsito, key management",
            why: "KMS gestiona claves de encryption para casi todo servicio de AWS (S3, EBS, RDS, etc.). Customer Managed Keys (CMK) te dan control sobre rotación, políticas de acceso y auditoría. CloudHSM ofrece hardware dedicado para compliance estricto (FIPS 140-2 Level 3). Entender key policies, grants, y cómo funciona envelope encryption — KMS encrypta una data key, la data key encrypta tus datos — es fundamental para cualquier sistema que maneje datos sensibles.",
            resource: { name: "AWS KMS — Developer Guide", url: "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html", free: true },
            miniDeliverable: "Crear una CMK con key policy que solo permita a un rol específico encrypt/decrypt. Encriptar un bucket S3 con esa CMK, rotar la key, y verificar que los datos siguen accesibles. Documentar el flujo de envelope encryption.",
          },
          {
            topic: "IAM avanzado: permission boundaries, session policies, cross-account roles",
            why: "Permission boundaries limitan los permisos máximos que un rol puede tener — útil para delegar creación de roles sin dar acceso ilimitado. Session policies restringen temporalmente un rol asumido. Cross-account roles permiten acceso entre cuentas sin compartir credentials. Estos mecanismos avanzados son lo que separa una postura de seguridad básica de una enterprise-grade. Son tema frecuente en el examen SA Pro.",
            resource: { name: "AWS IAM — Permission Boundaries", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html", free: true },
            miniDeliverable: "Crear un rol con permission boundary que limite los permisos a S3 y DynamoDB, incluso si la identity policy otorga Admin. Luego configurar cross-account access entre dos cuentas usando AssumeRole. Documentar el flujo de evaluación de IAM.",
          },
          {
            topic: "GuardDuty, Security Hub e Inspector: detección continua de amenazas",
            why: "GuardDuty analiza VPC Flow Logs, DNS logs y CloudTrail para detectar amenazas automáticamente — compromised instances, cryptocurrency mining, data exfiltration. Security Hub agrega findings de GuardDuty, Inspector, Macie y otros en un dashboard centralizado con compliance scores (CIS, PCI DSS). Inspector escanea EC2 y Lambda por vulnerabilidades. Juntos forman el sistema de detección que toda cuenta de producción necesita.",
            resource: { name: "AWS GuardDuty — User Guide", url: "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html", free: true },
            miniDeliverable: "Habilitar GuardDuty y Security Hub en tu cuenta. Generar sample findings en GuardDuty, revisar los resultados en Security Hub, y configurar una regla EventBridge que envíe findings de severidad HIGH a SNS.",
          },
          {
            topic: "Secrets Manager vs Parameter Store: gestión de secretos a escala",
            why: "Secrets Manager rota secrets automáticamente (ej: credenciales de RDS cada 30 días) y cobra por secret. Parameter Store SecureString encripta con KMS, es gratuito para estándar, pero no tiene rotación automática nativa. La decisión depende del caso: database credentials → Secrets Manager (rotación automática); feature flags, config strings → Parameter Store. Hardcodear secretos en código es el error #1 de seguridad en aplicaciones.",
            resource: { name: "AWS Secrets Manager — User Guide", url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html", free: true },
            miniDeliverable: "Configurar Secrets Manager para rotar automáticamente las credenciales de una instancia RDS. Verificar que la aplicación obtiene credentials actualizados sin downtime. Comparar costos con la misma implementación usando Parameter Store + Lambda custom.",
          },
        ],
      },
      /* ── Mes 3 ── */
      {
        label: "Mes 3",
        title: "Compliance, Auditoría y Proyecto de Seguridad",
        deliverable:
          "Landing zone multi-cuenta con Control Tower, CloudTrail centralizado, Config Rules para compliance, y GuardDuty aggregado.",
        metric:
          "Puedes diseñar una landing zone enterprise desde cero con governance, auditoría y detección de amenazas automatizada.",
        resources: [
          { name: "AWS Control Tower — User Guide", url: "https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html", free: true },
          { name: "AWS Config — Developer Guide", url: "https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html", free: true },
          { name: "AWS Well-Architected — Security Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html", free: true },
        ],
        objectives: [
          {
            topic: "AWS Config y Config Rules: compliance continuo automatizado",
            why: "AWS Config registra el historial de configuración de tus recursos — quién cambió qué, cuándo. Config Rules evalúan continuamente si los recursos cumplen con tus políticas (ej: 'todos los buckets S3 deben tener encryption habilitada'). Las reglas managed cubren los casos más comunes; custom rules con Lambda permiten validar cualquier cosa. Conformance Packs agrupan reglas en frameworks de compliance (CIS, PCI DSS, HIPAA).",
            resource: { name: "AWS Config — Managed Rules", url: "https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html", free: true },
            miniDeliverable: "Habilitar AWS Config con 5 managed rules (s3-bucket-versioning-enabled, ec2-instance-no-public-ip, rds-instance-public-access-check, iam-password-policy, cloudtrail-enabled). Crear un recurso non-compliant intencionalmente y verificar que Config lo detecta.",
          },
          {
            topic: "CloudTrail: auditoría completa y detección de actividad anómala",
            why: "CloudTrail registra cada llamada API en tu cuenta AWS — quién hizo qué, desde dónde, cuándo. Un trail multi-región con management events y data events te da visibilidad completa. CloudTrail Lake permite queries SQL sobre eventos. Integrar CloudTrail con CloudWatch Alarms detecta actividad sospechosa (ej: uso de root account, deshabilitación de MFA). Sin CloudTrail, estás ciego ante incidentes de seguridad.",
            resource: { name: "AWS CloudTrail — User Guide", url: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html", free: true },
            miniDeliverable: "Configurar un CloudTrail organization trail que centralice logs de todas las cuentas en un bucket S3 dedicado con KMS encryption. Crear CloudWatch Alarms para: uso de root account, cambios en IAM policies, y deshabilitación de CloudTrail.",
          },
          {
            topic: "Control Tower y Landing Zone: setup enterprise multi-cuenta",
            why: "Control Tower automatiza la creación de una landing zone con best practices de AWS: cuenta de log archive, cuenta de audit, guardrails preventivos y detectivos pre-configurados. Account Factory permite crear cuentas nuevas con baseline de seguridad consistente. Es la evolución de 'configurar Organizations manualmente' — una landing zone que tomaría semanas se configura en horas con governance built-in.",
            resource: { name: "AWS Control Tower — Getting Started", url: "https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-with-control-tower.html", free: true },
            miniDeliverable: "Documentar el diseño de una landing zone con Control Tower: diagrama de la estructura de cuentas (management, log archive, audit, workload accounts), lista de guardrails habilitados, y justificación de cada OU creada.",
          },
          {
            topic: "Proyecto integrador: landing zone segura multi-cuenta completa",
            why: "Este proyecto integra networking avanzado y seguridad en una arquitectura enterprise real. Combina Organizations + SCPs + Control Tower guardrails + CloudTrail centralizado + GuardDuty aggregado + Config Rules + encryption everywhere. Es el ejercicio más representativo de lo que un Solutions Architect diseña para empresas que migran a AWS por primera vez.",
            resource: { name: "AWS — Landing Zone Accelerator", url: "https://aws.amazon.com/solutions/implementations/landing-zone-accelerator-on-aws/", free: true },
            miniDeliverable: "Diseñar y documentar una landing zone completa para una empresa ficticia: organigrama de cuentas, topología de red (Transit Gateway + VPN), postura de seguridad (SCPs, encryption, threat detection), y compliance (Config Rules + audit trail). Presentar como un documento de arquitectura con diagramas.",
          },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════
     3.  COMPUTE & CONTAINERS
     ═══════════════════════════════════════════════════════════ */
  {
    id: "compute-containers",
    icon: "⚙️",
    color: "#E84855",
    title: "Compute & Containers",
    subtitle: "De EC2 a orquestación de contenedores y serverless a escala",
    period: "3 meses",
    periodLabel:
      "El compute moderno no es solo servidores. Containers y serverless cambian las reglas de scaling, costo y operación — dominar los tres modelos es lo que separa un cloud engineer de alguien que solo usa la consola.",
    phases: [
      /* ── Mes 1 ── */
      {
        label: "Mes 1",
        title: "Containers Fundamentals con ECS",
        deliverable:
          "Aplicación containerizada desplegada en ECS Fargate con ECR, service discovery, y CI/CD pipeline automatizado.",
        metric:
          "Puedes containerizar cualquier aplicación, optimizar su Dockerfile, y desplegarla en ECS explicando la diferencia entre Fargate y EC2 launch type.",
        resources: [
          { name: "Docker Official Documentation", url: "https://docs.docker.com/get-started/", free: true },
          { name: "AWS ECS Developer Guide", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html", free: true },
          { name: "Stephane Maarek — ECS Section (Udemy SAA)", url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/" },
        ],
        objectives: [
          {
            topic: "Docker deep dive: Dockerfile multi-stage, networking, volumes y best practices",
            why: "Containers son la unidad de deploy moderna. Multi-stage builds reducen el tamaño de imagen (de 1GB a 100MB) separando build dependencies de runtime. Docker networking (bridge, host, none) afecta cómo los containers se comunican. Volumes persisten datos más allá del lifecycle del container. Entender estas primitivas es requisito previo para ECS y EKS — sin Docker sólido, Kubernetes es inmanejable.",
            resource: { name: "Docker — Multi-stage Builds", url: "https://docs.docker.com/build/building/multi-stage/", free: true },
            miniDeliverable: "Escribir un Dockerfile multi-stage para una app Node.js que reduzca el tamaño de imagen a menos de 150MB. Comparar con un Dockerfile naive de single-stage. Documentar las best practices aplicadas (non-root user, .dockerignore, layer caching).",
          },
          {
            topic: "Amazon ECR: registro de imágenes, lifecycle policies e image scanning",
            why: "ECR es el registro de containers managed de AWS. Lifecycle policies eliminan automáticamente imágenes viejas (sin esto, los costos de storage crecen silenciosamente). Image scanning detecta vulnerabilidades conocidas (CVEs) antes de que lleguen a producción. Immutable tags previenen overwrites accidentales de imágenes productivas. ECR integra con IAM para control de acceso granular a nivel de repositorio.",
            resource: { name: "AWS ECR — User Guide", url: "https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html", free: true },
            miniDeliverable: "Crear un repositorio ECR con image scanning habilitado e immutable tags. Push una imagen, ejecutar scan, y revisar los findings. Configurar lifecycle policy que mantenga solo las últimas 10 imágenes.",
          },
          {
            topic: "ECS con Fargate: task definitions, services, networking modes",
            why: "ECS Fargate elimina la gestión de servidores — defines CPU y memoria, y AWS maneja la infraestructura subyacente. Task definitions son el blueprint del container (imagen, ports, variables, IAM role). Services mantienen el desired count de tasks corriendo y las registran en load balancers. awsvpc networking mode da a cada task su propia ENI con IP privada, integrándose nativamente con VPC security. Fargate es la opción recomendada para la mayoría de workloads.",
            resource: { name: "AWS ECS — Fargate", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html", free: true },
            miniDeliverable: "Desplegar una app en ECS Fargate con task definition que incluya: logging a CloudWatch, IAM task role para S3, variables de entorno desde Parameter Store, y health check. Conectar a un ALB y verificar que el service mantiene 2 tasks healthy.",
          },
          {
            topic: "ECS con EC2: capacity providers y cluster auto scaling",
            why: "El launch type EC2 te da control sobre las instancias subyacentes — necesario para GPU workloads, licensing por instancia, o cuando Fargate es más caro para workloads estables. Capacity providers automatizan la escala del cluster: agregan instancias EC2 cuando hay tasks pendientes y las drenan cuando sobran. Entender cuándo EC2 es mejor que Fargate (costo en workloads estables, GPU, compliance) es decisión de arquitectura frecuente.",
            resource: { name: "AWS ECS — Capacity Providers", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-capacity-providers.html", free: true },
            miniDeliverable: "Crear un cluster ECS con capacity provider basado en ASG. Desplegar un service que requiera más capacidad que la disponible y observar cómo el capacity provider agrega instancias automáticamente. Comparar el costo con el mismo service en Fargate.",
          },
          {
            topic: "Service discovery y load balancing para containers en ECS",
            why: "Service discovery permite que los containers se encuentren entre sí por nombre DNS (ej: api.local → container IP) sin hardcodear IPs. AWS Cloud Map integra con ECS para registro automático. Para tráfico externo, ALB con dynamic port mapping registra containers en target groups automáticamente. Para comunicación interna, service connect simplifica la malla de servicios sin necesidad de un service mesh completo.",
            resource: { name: "AWS ECS — Service Connect", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect.html", free: true },
            miniDeliverable: "Desplegar dos servicios en ECS (frontend y backend) que se comunican vía service discovery. El frontend resuelve el backend por nombre DNS. Documentar cómo Cloud Map registra las tasks y cómo se actualizan los registros durante un deployment.",
          },
        ],
      },
      /* ── Mes 2 ── */
      {
        label: "Mes 2",
        title: "Kubernetes en AWS con EKS",
        deliverable:
          "Cluster EKS con aplicación multi-servicio, Ingress controller, persistent storage, y observabilidad con Container Insights.",
        metric:
          "Puedes desplegar y operar un cluster EKS con networking, storage, y observabilidad, y explicar cuándo EKS es preferible a ECS.",
        resources: [
          { name: "AWS EKS User Guide", url: "https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html", free: true },
          { name: "Kubernetes Official Documentation", url: "https://kubernetes.io/docs/home/", free: true },
          { name: "EKS Workshop (AWS)", url: "https://www.eksworkshop.com/", free: true },
        ],
        objectives: [
          {
            topic: "EKS fundamentals: cluster setup, managed node groups, Fargate profiles",
            why: "EKS es Kubernetes managed por AWS. Managed node groups automatizan el lifecycle de los worker nodes (patching, scaling, draining). Fargate profiles permiten correr pods sin gestionar nodos — ideal para workloads intermitentes. Entender las opciones de compute (managed nodes, self-managed nodes, Fargate) y sus trade-offs de costo, control y capacidad es la primera decisión al adoptar EKS.",
            resource: { name: "AWS EKS — Getting Started", url: "https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html", free: true },
            miniDeliverable: "Crear un cluster EKS con managed node group y un Fargate profile. Desplegar un pod en cada uno, comparar el startup time, y documentar cuándo elegir managed nodes vs Fargate para diferentes tipos de workloads.",
          },
          {
            topic: "Kubernetes networking en AWS: VPC CNI plugin, ingress controllers",
            why: "El VPC CNI plugin asigna IPs de la VPC directamente a los pods — los pods son ciudadanos de primera clase en la red AWS, lo que simplifica security groups y NACLs. Los ingress controllers (AWS ALB Ingress Controller) crean ALBs automáticamente desde manifests de Kubernetes. Entender cómo el networking de Kubernetes se integra con VPC es clave para troubleshooting y security en EKS.",
            resource: { name: "AWS — VPC CNI Plugin", url: "https://docs.aws.amazon.com/eks/latest/userguide/pod-networking.html", free: true },
            miniDeliverable: "Configurar AWS Load Balancer Controller en EKS. Desplegar una aplicación con un Ingress resource que cree un ALB con path-based routing. Verificar que los pods tienen IPs de la VPC y que security groups funcionan a nivel de pod.",
          },
          {
            topic: "EKS storage: EBS CSI driver, EFS CSI driver, persistent volumes",
            why: "Los pods son efímeros — los datos se pierden cuando un pod muere. Persistent Volumes con EBS CSI driver proveen block storage (un pod a la vez). EFS CSI driver provee file storage compartido (muchos pods leen/escriben). StorageClasses automatizan el aprovisionamiento. Sin storage persistente correctamente configurado, no puedes correr databases, caches, o cualquier workload stateful en Kubernetes.",
            resource: { name: "AWS EKS — Storage", url: "https://docs.aws.amazon.com/eks/latest/userguide/storage.html", free: true },
            miniDeliverable: "Instalar EBS CSI driver y EFS CSI driver en EKS. Crear un StatefulSet con PersistentVolumeClaim usando EBS. Crear un Deployment con ReadWriteMany PVC usando EFS. Verificar que los datos persisten después de pod restarts.",
          },
          {
            topic: "Observabilidad en EKS: Container Insights, Prometheus, Grafana",
            why: "Container Insights integra con CloudWatch para métricas de cluster, nodos y pods sin configuración compleja. Para equipos que ya usan Prometheus, Amazon Managed Prometheus ofrece la misma experiencia sin operar servidores. Amazon Managed Grafana provee dashboards. La observabilidad en Kubernetes es más compleja que en EC2 — necesitas visibilidad a nivel de cluster, nodo, pod y container simultáneamente.",
            resource: { name: "AWS — Container Insights for EKS", url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-EKS-quickstart.html", free: true },
            miniDeliverable: "Habilitar Container Insights en el cluster EKS. Crear dashboards en CloudWatch que muestren CPU/memoria por pod, nodo y namespace. Simular un pod con OOMKill y verificar que Container Insights lo reporta.",
          },
          {
            topic: "CI/CD para containers: CodePipeline + CodeBuild con image builds automatizados",
            why: "Un pipeline de CI/CD para containers automatiza: build de imagen Docker, push a ECR, scan de vulnerabilidades, y deploy a ECS/EKS. CodeBuild compila y testea; CodePipeline orquesta el flujo end-to-end. Sin un pipeline, los deploys son manuales, propensos a error, y no reproducibles. El objetivo: un git push dispara automáticamente build → test → scan → deploy.",
            resource: { name: "AWS — CI/CD for ECS", url: "https://docs.aws.amazon.com/codepipeline/latest/userguide/ecs-cd-pipeline.html", free: true },
            miniDeliverable: "Crear un pipeline de CodePipeline que: detecte cambios en GitHub, ejecute CodeBuild para build + push a ECR, y haga deploy automático a ECS Fargate con rolling update. Verificar zero-downtime deployment con un cambio de versión.",
          },
        ],
      },
      /* ── Mes 3 ── */
      {
        label: "Mes 3",
        title: "Serverless y Proyecto de Migración",
        deliverable:
          "Arquitectura event-driven con Lambda, API Gateway, Step Functions y EventBridge, más migración documentada de monolito a containers+serverless.",
        metric:
          "Puedes diseñar arquitecturas serverless y event-driven, y decidir cuándo usar Lambda vs containers vs EC2 con justificación técnica y de costos.",
        resources: [
          { name: "AWS Lambda Developer Guide", url: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html", free: true },
          { name: "AWS Serverless Application Model (SAM)", url: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html", free: true },
          { name: "AWS — Serverless Land Patterns", url: "https://serverlessland.com/patterns", free: true },
        ],
        objectives: [
          {
            topic: "Lambda deep dive: cold starts, layers, concurrency, provisioned concurrency",
            why: "Lambda cobra por invocación y duración — perfecto para workloads intermitentes. Cold starts agregan 100ms-10s de latencia en la primera invocación (depende del runtime y VPC config). Layers permiten compartir código entre funciones. Reserved concurrency garantiza capacidad, provisioned concurrency elimina cold starts (con costo fijo). Entender estos trade-offs es crítico para decidir si Lambda es viable para tu caso de uso.",
            resource: { name: "AWS Lambda — Best Practices", url: "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html", free: true },
            miniDeliverable: "Crear una Lambda en VPC y otra sin VPC. Medir cold start de ambas con 10 invocaciones consecutivas. Configurar provisioned concurrency y medir de nuevo. Documentar cuándo el costo de provisioned concurrency se justifica.",
          },
          {
            topic: "API Gateway: REST vs HTTP APIs, authorization, throttling, caching",
            why: "API Gateway es el front door de las APIs serverless. HTTP APIs son más baratas y rápidas pero con menos features. REST APIs soportan caching, request validation, request/response transformation, y WAF integration. Authorizers (Cognito, Lambda, IAM) controlan acceso. Throttling y usage plans previenen abuse. La elección REST vs HTTP API depende de qué features necesitas — y cada una tiene pricing model diferente.",
            resource: { name: "AWS API Gateway — Developer Guide", url: "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html", free: true },
            miniDeliverable: "Crear una REST API con: Lambda authorizer custom, response caching de 5 minutos, throttling de 100 requests/segundo, y usage plan con API key. Comparar latencia y costo con la misma API en HTTP API format.",
          },
          {
            topic: "Step Functions: orquestación de workflows, error handling, parallel execution",
            why: "Step Functions orquesta workflows complejos como máquinas de estado visuales. Express workflows procesan 100K+ eventos/segundo para ETL. Standard workflows manejan procesos de larga duración (hasta 1 año). Error handling con Retry y Catch hace los workflows resilientes. Parallel states permiten ejecución concurrente. Sin Step Functions, la orquestación de múltiples Lambdas se convierte en callback hell.",
            resource: { name: "AWS Step Functions — Developer Guide", url: "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html", free: true },
            miniDeliverable: "Crear un Step Functions workflow que: reciba un archivo S3, ejecute 3 Lambdas en paralelo (validación, transformación, enriquecimiento), y consolide resultados. Implementar error handling con Retry (3 intentos, backoff exponencial) y Catch.",
          },
          {
            topic: "EventBridge y SQS/SNS: event-driven architectures y desacoplamiento",
            why: "EventBridge es el bus de eventos central de AWS — conecta servicios AWS, SaaS y aplicaciones custom con reglas de routing basadas en contenido del evento. SQS desacopla productores y consumidores con colas (Standard para throughput, FIFO para orden). SNS fan-out envía un mensaje a múltiples suscriptores. Juntos permiten arquitecturas donde los componentes no se conocen entre sí — el acoplamiento más bajo posible.",
            resource: { name: "AWS EventBridge — User Guide", url: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html", free: true },
            miniDeliverable: "Diseñar un sistema de procesamiento de órdenes event-driven: API Gateway → Lambda (crear orden) → EventBridge → 3 targets en paralelo (SQS para inventory, SNS para notificación, Lambda para analytics). Documentar el flujo de eventos y el manejo de fallos.",
          },
          {
            topic: "Proyecto: migrar un monolito a arquitectura mixta ECS + Lambda + API Gateway",
            why: "La migración de monolito a servicios distribuidos es uno de los ejercicios más representativos de lo que hacen los cloud engineers en la vida real. No todo se migra a Lambda — las funciones con estado van a containers, los procesadores de eventos a Lambda, las APIs a API Gateway. Este proyecto integra todo lo aprendido y demuestra criterio para elegir el modelo de compute correcto para cada componente.",
            resource: { name: "AWS — Microservices on AWS (Whitepaper)", url: "https://docs.aws.amazon.com/whitepapers/latest/microservices-on-aws/microservices-on-aws.html", free: true },
            miniDeliverable: "Tomar una app monolítica simple (ej: e-commerce con catálogo, carrito y pagos) y diseñar su migración: catálogo → ECS Fargate, procesamiento de pagos → Step Functions + Lambda, notificaciones → EventBridge + SNS. Documentar el diagrama antes/después con justificación de cada decisión.",
          },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════
     4.  DATA & STORAGE
     ═══════════════════════════════════════════════════════════ */
  {
    id: "data-storage",
    icon: "💾",
    color: "#4C8BFF",
    title: "Data & Storage",
    subtitle: "Servicios de datos especializados y patrones de acceso a escala",
    period: "3 meses",
    periodLabel:
      "Elegir el servicio de datos correcto es la decisión más costosa de revertir en AWS. Estos 3 meses te dan criterio para elegir entre 15+ servicios de datos sin adivinar — DynamoDB vs Aurora vs Redshift no son intercambiables.",
    phases: [
      /* ── Mes 1 ── */
      {
        label: "Mes 1",
        title: "NoSQL y Caching en AWS",
        deliverable:
          "Aplicación con DynamoDB single-table design, ElastiCache Redis como capa de caché, y documentación de access patterns.",
        metric:
          "Puedes modelar datos en DynamoDB con single-table design, explicar GSI vs LSI, y implementar caching patterns (cache-aside, write-through) con Redis.",
        resources: [
          { name: "AWS DynamoDB Developer Guide", url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html", free: true },
          { name: "Alex DeBrie — The DynamoDB Book", url: "https://www.dynamodbbook.com/" },
          { name: "AWS ElastiCache User Guide", url: "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html", free: true },
        ],
        objectives: [
          {
            topic: "DynamoDB deep dive: partition keys, sort keys, GSIs, LSIs, capacity modes",
            why: "DynamoDB es la base de datos NoSQL flagship de AWS — single-digit millisecond latency a cualquier escala. La elección de partition key determina la distribución de datos y los hot partitions. Sort keys permiten range queries dentro de una partición. GSIs proyectan datos en tablas paralelas con diferente key schema. On-demand mode cobra por request; provisioned mode tiene precio predecible. Estos conceptos son fundamentales y aparecen en todo examen de certificación.",
            resource: { name: "AWS DynamoDB — Core Components", url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html", free: true },
            miniDeliverable: "Crear una tabla DynamoDB con partition key y sort key para un caso de uso de e-commerce (OrderID + ProductID). Agregar un GSI para consultar por CustomerID. Documentar los access patterns soportados y los que requieren scan (anti-pattern).",
          },
          {
            topic: "DynamoDB avanzado: single-table design, transactions, streams, TTL",
            why: "Single-table design almacena múltiples entidades (usuarios, órdenes, productos) en una sola tabla, optimizando queries con overloaded keys y GSIs. Transactions garantizan ACID para escrituras multi-item. DynamoDB Streams captura cambios en tiempo real — trigger Lambda para event-driven processing. TTL elimina datos expirados automáticamente sin costo de write. Dominar single-table design es lo que separa a un DynamoDB principiante de un experto.",
            resource: { name: "Alex DeBrie — DynamoDB Single-Table Design", url: "https://www.alexdebrie.com/posts/dynamodb-single-table/", free: true },
            miniDeliverable: "Implementar single-table design para una app de blog: Users, Posts, Comments en una sola tabla con overloaded PK/SK. Documentar los 5 access patterns principales y cómo cada uno se resuelve con query (no scan).",
          },
          {
            topic: "ElastiCache: Redis vs Memcached, cluster mode, replication y caching patterns",
            why: "ElastiCache Redis soporta estructuras de datos avanzadas (sorted sets, pub/sub, streams), persistence, y replication — ideal como cache, session store, o leaderboard. Memcached es más simple y escala horizontalmente pero sin persistence ni replication. Cluster mode distribuye datos entre shards para superar el límite de memoria de un nodo. Caching patterns (cache-aside, write-through, write-behind) determinan consistencia vs performance.",
            resource: { name: "AWS ElastiCache — Redis", url: "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html", free: true },
            miniDeliverable: "Desplegar un cluster ElastiCache Redis con replication. Implementar cache-aside pattern en una Lambda que consulta DynamoDB: check cache → miss → query DynamoDB → set cache con TTL. Medir la mejora de latencia y documentar la estrategia de invalidation.",
          },
          {
            topic: "DocumentDB vs MongoDB: cuándo AWS-managed vs self-managed en EC2",
            why: "DocumentDB es compatible con MongoDB API pero no es MongoDB internamente — usa un storage engine similar a Aurora. Para la mayoría de workloads MongoDB, DocumentDB es suficiente y elimina la operación. Pero si necesitas features específicos de MongoDB (change streams avanzados, aggregation pipeline completo, MongoDB Atlas features), DocumentDB no los soporta. La decisión impacta costo, operación y capacidades — y es pregunta frecuente en el examen.",
            resource: { name: "AWS DocumentDB — Developer Guide", url: "https://docs.aws.amazon.com/documentdb/latest/developerguide/what-is.html", free: true },
            miniDeliverable: "Crear una tabla de comparación detallada: DocumentDB vs MongoDB en EC2 vs MongoDB Atlas — cubriendo compatibilidad, performance, costo, operación, y features soportados. Incluir 3 escenarios donde cada opción es la correcta.",
          },
          {
            topic: "Data modeling patterns: one-to-many, many-to-many, adjacency lists en NoSQL",
            why: "Modelar relaciones en NoSQL es fundamentalmente diferente a SQL. One-to-many se resuelve con sort keys o documento embebido. Many-to-many requiere adjacency lists o GSIs invertidos. El patrón de composite sort key (STATUS#TIMESTAMP) permite queries combinados eficientes. Estos patrones se aplican a DynamoDB y DocumentDB por igual, y entenderlos evita el error más común: usar NoSQL como si fuera SQL.",
            resource: { name: "AWS — NoSQL Design Patterns", url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-adjacency-graphs.html", free: true },
            miniDeliverable: "Implementar un modelo de datos para una red social en DynamoDB: Users, Posts, Followers (many-to-many), Comments (one-to-many). Usar adjacency list pattern para followers y documentar cómo resolver 'obtener todos los seguidores de un usuario' y 'obtener el feed del usuario' sin scan.",
          },
        ],
      },
      /* ── Mes 2 ── */
      {
        label: "Mes 2",
        title: "Analytics y Data Pipelines",
        deliverable:
          "Pipeline de datos con Kinesis ingesta, Glue ETL, S3 data lake, y queries con Athena y Redshift Spectrum.",
        metric:
          "Puedes diseñar un data pipeline completo (ingesta → transformación → almacenamiento → query) y elegir entre Redshift, Athena y EMR según el caso de uso.",
        resources: [
          { name: "AWS Big Data Analytics (Whitepaper)", url: "https://docs.aws.amazon.com/whitepapers/latest/big-data-analytics-options/welcome.html", free: true },
          { name: "AWS Kinesis Developer Guide", url: "https://docs.aws.amazon.com/streams/latest/dev/introduction.html", free: true },
          { name: "AWS Glue Developer Guide", url: "https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html", free: true },
        ],
        objectives: [
          {
            topic: "Aurora deep dive: multi-master, global databases, serverless v2",
            why: "Aurora es MySQL/PostgreSQL compatible con hasta 5x el throughput de MySQL estándar. El storage escala automáticamente hasta 128TB con 6 copias en 3 AZs. Global databases replican a 5 regiones secundarias con <1 segundo de lag. Aurora Serverless v2 escala compute automáticamente entre 0.5 y 128 ACUs — ideal para workloads variables. Aurora es la respuesta correcta para la mayoría de OLTP workloads en el examen SA Pro.",
            resource: { name: "AWS Aurora — User Guide", url: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html", free: true },
            miniDeliverable: "Desplegar Aurora PostgreSQL con un writer y 2 readers. Habilitar Performance Insights, ejecutar queries de diferentes complejidades, y analizar los wait events. Documentar cuándo Aurora Serverless v2 es más costo-eficiente que provisioned.",
          },
          {
            topic: "Redshift: data warehousing, Spectrum y concurrency scaling",
            why: "Redshift es el data warehouse de AWS para analytics — optimizado para queries analíticos sobre datos estructurados. Columnar storage reduce I/O dramáticamente para aggregations. Spectrum permite ejecutar queries sobre datos en S3 sin cargarlos a Redshift. Concurrency scaling agrega clusters efímeros cuando hay más queries de las que el cluster base puede manejar. Es la opción para BI/reporting sobre terabytes-petabytes de datos históricos.",
            resource: { name: "AWS Redshift — Getting Started", url: "https://docs.aws.amazon.com/redshift/latest/gsg/getting-started.html", free: true },
            miniDeliverable: "Crear un cluster Redshift, cargar un dataset de ejemplo (ej: TPC-H), y ejecutar queries analíticos. Comparar performance ejecutando el mismo query con Redshift Spectrum sobre el mismo dataset en S3. Documentar cuándo usar Redshift vs Athena.",
          },
          {
            topic: "Kinesis: Data Streams, Firehose y Analytics — streaming a escala",
            why: "Kinesis Data Streams ingesta datos en tiempo real con latencia de milisegundos y retention configurable (hasta 365 días). Firehose entrega datos automáticamente a S3, Redshift o OpenSearch con transformación opcional. Kinesis Analytics ejecuta SQL/Flink sobre streams en movimiento. Para cualquier caso de uso de streaming (logs, clickstream, IoT, event processing), Kinesis es el servicio core en AWS.",
            resource: { name: "AWS Kinesis Data Streams — Developer Guide", url: "https://docs.aws.amazon.com/streams/latest/dev/introduction.html", free: true },
            miniDeliverable: "Crear un Kinesis Data Stream con 2 shards. Producir eventos desde una Lambda, consumirlos con otra Lambda via event source mapping. Configurar Firehose para entregar los mismos datos a S3 en formato Parquet. Medir latencia end-to-end.",
          },
          {
            topic: "AWS Glue y Athena: ETL serverless y queries sobre S3",
            why: "Glue descubre schema automáticamente (Crawlers), cataloga metadatos (Data Catalog), y ejecuta jobs de ETL serverless (PySpark). Athena ejecuta queries SQL directamente sobre datos en S3 usando el catálogo de Glue — sin servidores, pagas solo por datos escaneados. Juntos forman la base de un data lake serverless. Particionar datos en S3 y usar formatos columnares (Parquet, ORC) reduce costos de Athena 90%+.",
            resource: { name: "AWS Athena — User Guide", url: "https://docs.aws.amazon.com/athena/latest/ug/what-is.html", free: true },
            miniDeliverable: "Configurar un Glue Crawler para descubrir el schema de datos en S3 (CSV). Crear un Glue ETL job que transforme los datos a formato Parquet particionado por fecha. Ejecutar queries con Athena y comparar costo/performance entre el dataset CSV original y el Parquet particionado.",
          },
          {
            topic: "Lake Formation: data lake governance y seguridad centralizada",
            why: "Lake Formation simplifica la creación de data lakes seguros. En lugar de gestionar permisos a nivel de S3 bucket policies, IAM policies, y Glue catalog policies individualmente, Lake Formation centraliza todo en un modelo de permisos tipo base de datos (GRANT SELECT ON table TO role). Integra con Glue, Athena, Redshift Spectrum, y EMR. Para organizaciones con múltiples equipos accediendo al data lake, la governance es obligatoria.",
            resource: { name: "AWS Lake Formation — Developer Guide", url: "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html", free: true },
            miniDeliverable: "Configurar Lake Formation como capa de governance sobre un data lake S3 + Glue. Crear 2 roles con permisos diferentes (uno con acceso a todas las columnas, otro con column-level filtering). Verificar que Athena respeta los permisos de Lake Formation.",
          },
        ],
      },
      /* ── Mes 3 ── */
      {
        label: "Mes 3",
        title: "Migración de Datos y Proyecto de Data Lake",
        deliverable:
          "Data lake completo con ingesta streaming, ETL, storage optimizado, query layer, y governance — todo documentado como arquitectura de referencia.",
        metric:
          "Puedes diseñar un data lake end-to-end con ingesta, transformación, storage, query y governance, y elegir los servicios correctos para cada capa.",
        resources: [
          { name: "AWS Database Migration Service — User Guide", url: "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html", free: true },
          { name: "AWS — Data Lake Architecture", url: "https://docs.aws.amazon.com/whitepapers/latest/building-data-lakes/building-data-lake-aws.html", free: true },
          { name: "AWS Backup — Developer Guide", url: "https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html", free: true },
        ],
        objectives: [
          {
            topic: "DMS y SCT: migración de bases de datos homogénea y heterogénea",
            why: "Database Migration Service replica datos desde y hacia bases de datos on-premises, EC2, y RDS. Para migraciones homogéneas (MySQL → RDS MySQL), DMS copia directamente. Para heterogéneas (Oracle → Aurora PostgreSQL), Schema Conversion Tool (SCT) traduce el schema y DMS migra los datos. La migración de base de datos es uno de los primeros pasos en cualquier migración a cloud — y uno de los que más riesgo conlleva si se hace mal.",
            resource: { name: "AWS DMS — Getting Started", url: "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_GettingStarted.html", free: true },
            miniDeliverable: "Configurar DMS para migrar una base PostgreSQL local a RDS Aurora PostgreSQL con continuous replication (CDC). Documentar el proceso, medir el lag de replicación, y planificar el cutover window con zero-downtime.",
          },
          {
            topic: "Data backup y recovery: AWS Backup, cross-region replication patterns",
            why: "AWS Backup centraliza el backup de 15+ servicios (RDS, DynamoDB, EBS, EFS, S3, etc.) con políticas consistentes. Cross-region copy protege contra disaster regional. Backup vaults con access policies previenen deletion accidental o maliciosa. El RPO (Recovery Point Objective) y RTO (Recovery Time Objective) determinan la estrategia: backup diario ≠ replicación continua. Un plan de backup no testeado es un plan que no funciona.",
            resource: { name: "AWS Backup — Getting Started", url: "https://docs.aws.amazon.com/aws-backup/latest/devguide/getting-started.html", free: true },
            miniDeliverable: "Crear un plan de AWS Backup que cubra RDS, DynamoDB y EFS con retention de 30 días y cross-region copy. Simular un disaster scenario: borrar una tabla DynamoDB y restaurarla desde backup. Medir el RTO real.",
          },
          {
            topic: "Estrategias de caching: invalidation, write-through, lazy loading en producción",
            why: "El caching a escala es un problema de ingeniería, no de configuración. Cache invalidation es 'uno de los dos problemas difíciles de computer science'. Lazy loading (cache-aside) tiene cache miss penalty; write-through mantiene cache fresh pero agrega latencia en escrituras; write-behind reduce latencia pero puede perder datos. En producción, la estrategia de caching impacta directamente la experiencia del usuario y el costo de la base de datos.",
            resource: { name: "AWS — Caching Best Practices", url: "https://aws.amazon.com/caching/best-practices/", free: true },
            miniDeliverable: "Implementar los 3 caching patterns (lazy loading, write-through, write-behind) con ElastiCache Redis y DynamoDB. Comparar latencia, consistencia y comportamiento ante cache miss. Documentar cuándo usar cada patrón con ejemplos reales.",
          },
          {
            topic: "Proyecto: data lake con Kinesis, Glue, S3, Athena y Redshift Spectrum",
            why: "Este proyecto integra todos los servicios de datos aprendidos en un pipeline end-to-end. Ingesta en tiempo real, transformación ETL, almacenamiento optimizado, múltiples capas de query, y governance — es exactamente lo que las empresas construyen para sus plataformas de datos. Es el proyecto más complejo del trimestre y demuestra capacidad para diseñar arquitecturas de datos a escala enterprise.",
            resource: { name: "AWS — Building a Data Lake on AWS", url: "https://docs.aws.amazon.com/whitepapers/latest/building-data-lakes/building-data-lake-aws.html", free: true },
            miniDeliverable: "Construir un data lake completo: Kinesis → Firehose → S3 (raw) → Glue ETL → S3 (processed, Parquet particionado) → Athena + Redshift Spectrum para queries. Configurar Lake Formation para governance. Documentar la arquitectura como referencia con costos estimados.",
          },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════
     5.  ARQUITECTURA & CONFIABILIDAD
     ═══════════════════════════════════════════════════════════ */
  {
    id: "arquitectura-confiabilidad",
    icon: "🏛️",
    color: "#C084FC",
    title: "Arquitectura & Confiabilidad",
    subtitle:
      "Well-Architected, HA/DR, optimización de costos y preparación para la certificación SA Pro",
    period: "3 meses",
    periodLabel:
      "Los últimos 3 meses integran todo lo aprendido en decisiones de arquitectura a nivel senior. El objetivo final: pensar como un Solutions Architect Professional — elegir, justificar y defender decisiones de diseño.",
    phases: [
      /* ── Mes 1 ── */
      {
        label: "Mes 1",
        title: "Well-Architected Framework: Los 6 Pilares",
        deliverable:
          "Well-Architected Review completo de una arquitectura propia usando la herramienta oficial de AWS, con plan de remediación.",
        metric:
          "Puedes evaluar cualquier arquitectura AWS contra los 6 pilares del Well-Architected Framework y proponer mejoras concretas para cada pilar.",
        resources: [
          { name: "AWS Well-Architected Framework (Whitepaper)", url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html", free: true },
          { name: "AWS Well-Architected Tool", url: "https://aws.amazon.com/well-architected-tool/", free: true },
          { name: "AWS Well-Architected Labs", url: "https://www.wellarchitectedlabs.com/", free: true },
        ],
        objectives: [
          {
            topic: "Pilar de Excelencia Operativa: IaC, observabilidad, runbooks y mejora continua",
            why: "Excelencia Operativa es el pilar que nadie estudia primero pero que más impacta en producción. IaC elimina drift y habilita reproducibilidad. Observabilidad con métricas, logs y traces permite entender el estado del sistema. Runbooks documentan procedimientos para incidentes. Game days simulan fallos para validar la preparación del equipo. Sin operaciones excelentes, la mejor arquitectura falla en producción.",
            resource: { name: "Well-Architected — Operational Excellence Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html", free: true },
            miniDeliverable: "Escribir 3 runbooks operativos para tu arquitectura 3-tier: (1) respuesta a CPU alto sostenido, (2) failover de base de datos, (3) rollback de deployment fallido. Cada runbook con pasos claros, comandos específicos, y criterios de escalación.",
          },
          {
            topic: "Pilar de Seguridad: zero trust, defense in depth e incident response",
            why: "El pilar de Seguridad del Well-Architected Framework va más allá de IAM. Zero trust asume que ningún componente es confiable por defecto — todo acceso se verifica. Defense in depth aplica controles en cada capa (edge, red, aplicación, datos). Incident response define cómo detectar, contener, erradicar y recuperarse de un incidente. La certificación SA Pro espera que puedas diseñar la postura de seguridad completa de una organización.",
            resource: { name: "Well-Architected — Security Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html", free: true },
            miniDeliverable: "Diseñar la postura de seguridad completa para una aplicación financiera en AWS: diagrama de defense in depth con controles en cada capa, plan de incident response con timeline, y checklist de compliance para PCI DSS.",
          },
          {
            topic: "Pilar de Confiabilidad: fault isolation, DR strategies y chaos engineering",
            why: "Confiabilidad es la capacidad de un sistema para recuperarse de fallos. Fault isolation (celdas, bulkheads) previene que un fallo se propague. Las 4 estrategias de DR tienen trade-offs claros: Backup/Restore (RPO horas, bajo costo), Pilot Light (RPO minutos), Warm Standby (RPO segundos), Active-Active (RPO ~0, alto costo). Chaos engineering valida que la arquitectura realmente sobrevive fallos — no solo en teoría.",
            resource: { name: "Well-Architected — Reliability Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html", free: true },
            miniDeliverable: "Crear una tabla comparativa de las 4 estrategias de DR con: RPO, RTO, costo relativo, servicios AWS involucrados, y un escenario de negocio donde cada una es la correcta. Diseñar la estrategia de DR para una app de e-commerce con RPO < 15 min y RTO < 1 hora.",
          },
          {
            topic: "Pilar de Eficiencia de Performance: selección de recursos y benchmarking",
            why: "Este pilar enseña a elegir los tipos de recursos correctos (compute, storage, database, network) basándose en datos, no en intuición. Benchmarking compara opciones reales (ej: Aurora vs DynamoDB para tu patrón de acceso). Caching reduce latencia y carga. CDN acerca contenido a los usuarios. El Well-Architected Framework enfatiza: monitorear performance continuamente y adaptar la arquitectura cuando los patrones de uso cambian.",
            resource: { name: "Well-Architected — Performance Efficiency Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html", free: true },
            miniDeliverable: "Hacer un benchmark comparativo para un caso de uso real: comparar RDS PostgreSQL vs Aurora PostgreSQL vs DynamoDB para el mismo patrón de acceso. Documentar latencia, throughput, costo por query, y recomendación con justificación.",
          },
          {
            topic: "Pilar de Optimización de Costos: rightsizing, Savings Plans y spot instances",
            why: "El costo en cloud es un problema de ingeniería. Rightsizing usa CloudWatch y Compute Optimizer para identificar instancias over-provisioned. Savings Plans ofrecen hasta 72% de descuento por compromiso de uso. Spot instances ahorran hasta 90% para workloads tolerantes a interrupciones. Cost allocation tags permiten chargeback por equipo/proyecto. Sin una estrategia de costos, la factura de AWS crece 3x en 6 meses sin que nadie se dé cuenta.",
            resource: { name: "Well-Architected — Cost Optimization Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html", free: true },
            miniDeliverable: "Analizar una cuenta AWS (propia o de ejemplo) con Cost Explorer y Compute Optimizer. Identificar 3 oportunidades de ahorro concretas, calcular el ahorro estimado, y crear un plan de implementación con timeline. Presentar como un cost optimization report.",
          },
        ],
      },
      /* ── Mes 2 ── */
      {
        label: "Mes 2",
        title: "Patrones de Alta Disponibilidad y Arquitectura Avanzada",
        deliverable:
          "Arquitectura multi-región con failover automático, IaC en CDK/Terraform, y documentación de decisiones como ADRs.",
        metric:
          "Puedes diseñar arquitecturas multi-región con DR automatizado y justificar cada decisión de diseño con trade-offs explícitos.",
        resources: [
          { name: "AWS — Disaster Recovery Workloads (Whitepaper)", url: "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html", free: true },
          { name: "Terraform — AWS Provider Docs", url: "https://registry.terraform.io/providers/hashicorp/aws/latest/docs", free: true },
          { name: "AWS CDK — Developer Guide", url: "https://docs.aws.amazon.com/cdk/v2/guide/home.html", free: true },
        ],
        objectives: [
          {
            topic: "Multi-Region architectures: active-passive vs active-active y data replication",
            why: "Multi-región es la forma más robusta de alta disponibilidad — sobrevive al fallo de una región completa. Active-passive mantiene una región en standby con datos replicados; active-active procesa tráfico en ambas regiones simultáneamente. La replicación de datos es el desafío principal: Aurora Global Database, DynamoDB Global Tables, y S3 Cross-Region Replication tienen diferentes garantías de consistencia. La elección impacta RPO, RTO, costo y complejidad operativa.",
            resource: { name: "AWS — Multi-Region Fundamentals", url: "https://docs.aws.amazon.com/whitepapers/latest/aws-multi-region-fundamentals/aws-multi-region-fundamentals.html", free: true },
            miniDeliverable: "Diseñar una arquitectura multi-región active-passive con: Route 53 failover routing, Aurora Global Database, S3 CRR, y ALB health checks. Documentar el runbook de failover, el RPO/RTO esperado, y el costo adicional vs single-region.",
          },
          {
            topic: "IaC avanzado: CDK vs CloudFormation vs Terraform — cuándo usar cada uno",
            why: "CloudFormation es nativo AWS con la mayor cobertura de servicios. CDK genera CloudFormation desde TypeScript/Python — mejor abstracción, testing con frameworks estándar, y composición de constructs. Terraform es multi-cloud con un ecosystem de providers masivo y state management flexible. La elección depende del contexto: puro AWS → CDK; multi-cloud → Terraform; legacy templates → CloudFormation directamente. El examen SA Pro espera que entiendas los trade-offs.",
            resource: { name: "AWS CDK — Getting Started", url: "https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html", free: true },
            miniDeliverable: "Implementar la misma infraestructura (VPC + ALB + ECS Fargate + RDS) en CDK y en Terraform. Comparar: líneas de código, legibilidad, testing capabilities, deployment experience, y state management. Documentar la recomendación para tu equipo.",
          },
          {
            topic: "Disaster Recovery: RPO/RTO planning, DR drills y automated failover",
            why: "Un plan de DR que no se prueba es un plan que no funciona. DR drills simulan escenarios reales: fallo de AZ, fallo de región, corrupción de datos, fallo de servicio AWS. Automated failover con Route 53, CloudWatch Alarms, y Lambda reduce el RTO de horas a minutos. El RPO/RTO que tu negocio necesita determina la estrategia y el costo — no al revés. El examen SA Pro tiene escenarios de DR en prácticamente cada dominio.",
            resource: { name: "AWS — Disaster Recovery Options", url: "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html", free: true },
            miniDeliverable: "Crear un runbook de DR drill completo: (1) pre-checks, (2) simular fallo de región primary, (3) validar failover automático de DNS + database, (4) verificar app functionality en secondary, (5) failback procedure. Ejecutar el drill y documentar los resultados y gaps encontrados.",
          },
          {
            topic: "Microservicios en AWS: App Mesh, service discovery y distributed tracing",
            why: "Los microservicios resuelven problemas de escala organizacional (equipos independientes) pero crean problemas técnicos nuevos: service discovery, load balancing entre servicios, circuit breaking, retry policies, y observabilidad distribuida. App Mesh implementa un service mesh con Envoy proxies que manejan estos problemas sin modificar código de aplicación. X-Ray proporciona distributed tracing para identificar latencia entre servicios.",
            resource: { name: "AWS App Mesh — User Guide", url: "https://docs.aws.amazon.com/app-mesh/latest/userguide/what-is-app-mesh.html", free: true },
            miniDeliverable: "Desplegar 3 microservicios en ECS conectados vía App Mesh. Configurar retry policies y circuit breaker. Habilitar X-Ray tracing y visualizar la latencia entre servicios. Documentar cómo App Mesh previene cascading failures.",
          },
          {
            topic: "Cost optimization avanzado: Compute Optimizer, Savings Plans vs RI, spot handling",
            why: "El costo es el sexto pilar del Well-Architected Framework (Sustainability es un séptimo informal). Compute Optimizer analiza patrones de uso y recomienda rightsizing con machine learning. Savings Plans son más flexibles que Reserved Instances (aplican a EC2, Fargate, Lambda). Spot instances con interruption handling (2-minute warning) ahorran 60-90% para batch processing, CI/CD, y stateless workloads. Un FinOps practice maduro reduce la factura 30-50%.",
            resource: { name: "AWS — Cost Optimization Hub", url: "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html", free: true },
            miniDeliverable: "Crear un dashboard de Cost Explorer con: costo por servicio, costo por equipo (usando tags), trend de los últimos 3 meses, y forecast del próximo mes. Identificar el top 3 de oportunidades de ahorro y calcular el ROI de implementar Savings Plans vs seguir con On-Demand.",
          },
        ],
      },
      /* ── Mes 3 ── */
      {
        label: "Mes 3",
        title: "Certificación SA Pro y Proyecto Final",
        deliverable:
          "Arquitectura enterprise completa documentada como caso de estudio + aprobación de la certificación AWS Solutions Architect Professional.",
        metric:
          "Puedes diseñar, defender y documentar una arquitectura enterprise completa en AWS, y aprobar el examen SA Pro con confianza.",
        resources: [
          { name: "Tutorials Dojo — SA Pro Practice Exams (Jon Bonso)", url: "https://tutorialsdojo.com/courses/aws-certified-solutions-architect-professional-practice-exams/" },
          { name: "AWS — SA Pro Exam Guide", url: "https://d1.awsstatic.com/training-and-certification/docs-sa-pro/AWS-Certified-Solutions-Architect-Professional_Exam-Guide.pdf", free: true },
          { name: "Adrian Cantrill — SA Pro Course", url: "https://learn.cantrill.io/p/aws-certified-solutions-architect-professional" },
        ],
        objectives: [
          {
            topic: "Simulacros de examen SA Pro: practice tests intensivos",
            why: "El examen SA Pro tiene 75 preguntas en 180 minutos — cada pregunta presenta escenarios largos con múltiples soluciones viables. Los practice tests de Tutorials Dojo (Jon Bonso) son los más representativos del examen real. El objetivo no es memorizar respuestas sino entender por qué cada opción es correcta o incorrecta. Hacer 4-5 simulacros completos y analizar cada pregunta errada es la forma más eficiente de prepararse.",
            resource: { name: "Tutorials Dojo — SA Pro Practice Exams", url: "https://tutorialsdojo.com/courses/aws-certified-solutions-architect-professional-practice-exams/" },
            miniDeliverable: "Completar 3 simulacros completos (75 preguntas cada uno). Para cada simulacro: registrar el score, crear un documento con las preguntas erradas, explicar por qué la respuesta correcta es correcta, y agrupar los errores por dominio para identificar áreas débiles.",
          },
          {
            topic: "Revisión de servicios clave: decisión rápida entre 3+ opciones por caso de uso",
            why: "El SA Pro espera que distingas rápidamente entre servicios similares. DynamoDB vs Aurora vs DocumentDB para una app: depende del access pattern. Kinesis vs SQS vs EventBridge para event processing: depende de latencia, ordering, y fan-out. ECS vs EKS vs Lambda: depende de control, equipo, y tipo de workload. Crear decision matrices para las comparaciones más frecuentes acelera el razonamiento durante el examen.",
            resource: { name: "AWS — SA Pro Exam Readiness", url: "https://explore.skillbuilder.aws/learn/course/external/view/elearning/14951/exam-prep-aws-certified-solutions-architect-professional-sap-c02", free: true },
            miniDeliverable: "Crear 5 decision matrices para las comparaciones más frecuentes: (1) DynamoDB vs Aurora vs RDS, (2) Kinesis vs SQS vs EventBridge, (3) ECS vs EKS vs Lambda, (4) CloudFront vs Global Accelerator, (5) Direct Connect vs VPN vs Transit Gateway. Cada matriz con criterios, scores, y escenario de uso ganador.",
          },
          {
            topic: "Caso de estudio: migración enterprise completa a AWS",
            why: "La migración enterprise es el escenario más completo del examen SA Pro. Combina: evaluación del portfolio de aplicaciones (7 Rs de migración), diseño de landing zone multi-cuenta, conectividad híbrida, estrategia de datos, security posture, y operational readiness. Un caso de estudio end-to-end demuestra que puedes integrar todos los dominios del examen en una solución coherente.",
            resource: { name: "AWS — Migration Whitepaper", url: "https://docs.aws.amazon.com/whitepapers/latest/aws-migration-whitepaper/welcome.html", free: true },
            miniDeliverable: "Diseñar la migración completa de una empresa ficticia (5 apps, on-premises, 3 bases de datos, compliance requirements): evaluar cada app con las 7 Rs, diseñar la landing zone, planificar la migración de datos, y crear un timeline de 6 meses con milestones. Presentar como un documento de arquitectura de 10+ páginas.",
          },
          {
            topic: "Proyecto final: arquitectura enterprise multi-región, HA, DR y cost-optimized",
            why: "El proyecto final es la pieza de portfolio más importante del roadmap. Integra los 12 meses de aprendizaje en una arquitectura completa: multi-región, alta disponibilidad, disaster recovery, seguridad enterprise, data platform, y optimización de costos. Debe demostrar no solo que sabes usar los servicios, sino que puedes justificar cada decisión con trade-offs explícitos.",
            resource: { name: "AWS — Architecture Center", url: "https://aws.amazon.com/architecture/", free: true },
            miniDeliverable: "Diseñar una arquitectura completa para una fintech: multi-región active-passive con RPO < 5min, EKS para microservicios, Aurora Global Database, Kinesis para event streaming, data lake con Athena, security con WAF + GuardDuty + Control Tower, y cost optimization con Savings Plans. Documentar con diagramas de arquitectura, ADRs para cada decisión, y estimación de costos mensuales.",
          },
          {
            topic: "Presentación técnica: defender tu arquitectura como Solutions Architect",
            why: "La habilidad más valiosa de un Solutions Architect no es diseñar — es comunicar y defender. Presentar una arquitectura técnica a stakeholders (técnicos y de negocio) requiere explicar el 'por qué' de cada decisión, no solo el 'qué'. El formato de presentación fuerza a simplificar, priorizar, y anticipar preguntas. Este ejercicio es la prueba final de que el conocimiento técnico se convirtió en criterio de arquitectura.",
            resource: { name: "AWS — This is My Architecture (Videos)", url: "https://aws.amazon.com/architecture/this-is-my-architecture/", free: true },
            miniDeliverable: "Preparar una presentación de 15 minutos sobre el proyecto final. Incluir: problema de negocio, requisitos técnicos, arquitectura propuesta con diagrama, 3 decisiones clave con alternativas rechazadas, plan de DR, y estimación de costos. Presentar a un colega o grabar un video y auto-evaluarse.",
          },
        ],
      },
    ],
  },
];

export { CLOUD_AWS_ICON_MAP, CloudAwsAreaIcon, cloudAwsData };
