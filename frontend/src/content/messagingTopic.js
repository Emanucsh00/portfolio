export const messagingTopic = {
  title: 'RabbitMQ y Apache ActiveMQ',
  subtitle: 'Colas de mensajes y desacoplamiento de sistemas',
  presenter: 'Emanuel Castro',
  heroNote:
    'Una landing explicativa para presentar como los brokers de mensajeria desacoplan servicios, mejoran escalabilidad y organizan flujos asincronos.',
  intro: {
    eyebrow: 'POR QUE IMPORTA',
    title: 'Cuando dos sistemas dependen entre si, cualquier falla se propaga',
    body:
      'Si una aplicacion A necesita que B responda en el mismo momento, ambos quedan fuertemente acoplados. Ese modelo complica el crecimiento, vuelve fragiles los despliegues y eleva el impacto de cualquier caida.'
  },
  queueDefinition: {
    eyebrow: 'LA SOLUCION',
    title: 'Una cola de mensajes introduce un intermediario',
    body:
      'El productor publica un mensaje y continua. El broker lo almacena y lo entrega cuando el consumidor esta listo. Esto habilita comunicacion asincrona, control de carga y desacoplamiento real.'
  },
  concepts: [
    {
      title: 'Productor',
      description: 'Servicio que envia mensajes o eventos.'
    },
    {
      title: 'Broker',
      description: 'Intermediario que recibe, enruta y entrega.'
    },
    {
      title: 'Cola',
      description: 'Estructura donde los mensajes esperan consumo.'
    },
    {
      title: 'Consumidor',
      description: 'Servicio que recibe y procesa el mensaje.'
    }
  ],
  brokers: [
    {
      name: 'RabbitMQ',
      accent: 'orange',
      points: [
        'Broker open source muy usado en microservicios.',
        'Trabaja con AMQP y permite exchanges para enrutar mensajes.',
        'Es flexible para patrones de trabajo, eventos y colas clasicas.'
      ],
      summary:
        'RabbitMQ destaca por su modelo de exchanges, routing keys y patrones como direct, fanout y topic.'
    },
    {
      name: 'Apache ActiveMQ',
      accent: 'violet',
      points: [
        'Broker popular en ecosistemas empresariales.',
        'Tiene fuerte afinidad con Java y JMS.',
        'Soporta modelos punto a punto y publicacion/suscripcion.'
      ],
      summary:
        'ActiveMQ suele aparecer en aplicaciones enterprise donde JMS y la integracion con Java son una prioridad.'
    }
  ],
  differences: [
    {
      rabbit: 'AMQP',
      active: 'JMS'
    },
    {
      rabbit: 'Exchange',
      active: 'Queue o Topic'
    },
    {
      rabbit: 'Multilenguaje',
      active: 'Foco fuerte en Java'
    }
  ],
  rabbitFlow: [
    'El productor publica un mensaje en un exchange.',
    'El exchange decide a que cola enviarlo segun reglas de enrutamiento.',
    'La cola retiene el mensaje hasta que un consumidor lo procesa.'
  ],
  activeModels: [
    {
      title: 'Queue',
      description: 'Un mensaje suele ser procesado por un solo consumidor.'
    },
    {
      title: 'Topic',
      description: 'Un mensaje puede distribuirse a varios suscriptores a la vez.'
    }
  ],
  queueTypes: [
    {
      title: 'Standard',
      description: 'Maximiza velocidad y throughput.'
    },
    {
      title: 'FIFO',
      description: 'Preserva el orden de los mensajes.'
    },
    {
      title: 'Priority',
      description: 'Procesa primero los mensajes mas criticos.'
    },
    {
      title: 'DLQ',
      description: 'Guarda mensajes fallidos para analisis.'
    }
  ],
  reliability: [
    {
      title: 'ACK',
      description:
        'El consumidor confirma que proceso correctamente el mensaje antes de eliminarlo.'
    },
    {
      title: 'DLQ',
      description:
        'Cuando un mensaje falla varias veces o no puede procesarse, se envia a una cola muerta para auditoria.'
    }
  ],
  sns: {
    eyebrow: 'PUB SUB EN AWS',
    title: 'SNS distribuye un mismo evento a multiples destinos',
    body:
      'Amazon SNS sigue el modelo publicacion y suscripcion. Un productor publica una vez y varios suscriptores reciben el mismo evento: email, backend, colas SQS o otros servicios.'
  },
  conclusion:
    'RabbitMQ y ActiveMQ resuelven el mismo problema: desacoplar sistemas y mejorar la escalabilidad. SNS aporta el patron pub/sub en cloud para distribuir eventos a multiples consumidores de forma simple y rapida.'
};
