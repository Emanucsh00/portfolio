import 'dotenv/config';
import { connectDatabase } from '../config/database.js';
import { ExpositionTopic, syncModels } from '../models/index.js';

const exposition = {
  title: 'RabbitMQ y Apache ActiveMQ',
  summary:
    'Exposición sobre colas de mensajes, desacoplamiento de sistemas, conceptos base de mensajería y diferencias principales entre RabbitMQ y Apache ActiveMQ.',
  content: `Colas de mensajes y desacoplamiento de sistemas
Autor: Emanuel Castro

Problema inicial
Cuando dos sistemas se comunican directamente se vuelven dependientes. Si uno falla, el otro también se ve afectado y la arquitectura escala mal.

Solución
Una cola de mensajes introduce un intermediario que permite comunicación asíncrona y desacoplada entre aplicaciones.

¿Qué es una cola de mensajes?
Es un sistema que permite enviar mensajes entre aplicaciones sin que estén directamente conectadas. Su objetivo principal es desacoplar componentes, mejorar la escalabilidad y aumentar la tolerancia a fallos.

Conceptos base
- Productor: envía mensajes.
- Consumidor: recibe mensajes.
- Mensaje: información transferida.
- Broker: intermediario que recibe y distribuye mensajes.
- Cola: estructura donde se almacenan mensajes hasta ser procesados.

RabbitMQ
RabbitMQ es un broker open source que utiliza el protocolo AMQP. Es muy usado en arquitecturas de microservicios porque permite enrutar mensajes mediante exchanges antes de enviarlos a las colas correspondientes.

Apache ActiveMQ
ActiveMQ es un broker orientado a Java que trabaja con el estándar JMS. Es muy común en entornos empresariales y aplicaciones enterprise por su integración con ecosistemas Java.

Diferencias principales
- RabbitMQ: AMQP, exchange, enfoque multilenguaje.
- Apache ActiveMQ: JMS, queue/topic, fuerte adopción en Java.
- Ambos cumplen el mismo propósito, pero con tecnologías y enfoques diferentes.

Arquitectura general
El productor emite mensajes, el broker los recibe y la cola los conserva hasta que un consumidor los procesa.

Funcionamiento interno en RabbitMQ
El productor no envía el mensaje directamente a la cola, sino a un exchange. El exchange decide a qué cola debe enviarse según las reglas de enrutamiento.

Modelos de ActiveMQ
ActiveMQ maneja dos modelos principales:
- Punto a punto.
- Publicación / suscripción.

Tipos de colas de mensajes
- Colas estándar: priorizan velocidad.
- Colas FIFO: garantizan orden.
- Colas con prioridad: procesan primero mensajes críticos.
- Dead Letter Queue: almacenan mensajes fallidos para análisis.

ACK
El acknowledgement confirma que un mensaje fue procesado correctamente.

DLQ
Los mensajes que fallan se envían a una Dead Letter Queue para diagnóstico y reproceso posterior.

SNS
Simple Notification Service permite publicar un mensaje en un topic para que múltiples suscriptores lo reciban al mismo tiempo.

¿Cómo funciona SNS?
Un productor publica un mensaje en un topic y todos los suscriptores asociados reciben ese mensaje simultáneamente.

Conclusión
En arquitecturas modernas es común usar servicios de difusión de eventos como SNS para distribuir mensajes y colas como SQS o brokers tradicionales para procesarlos de forma controlada. RabbitMQ y ActiveMQ siguen siendo opciones muy válidas para diseñar sistemas desacoplados, escalables y resilientes.`,
  presentation_url: '',
  is_public: true
};

async function run() {
  await connectDatabase();
  await syncModels();

  const existing = await ExpositionTopic.findOne({
    where: { title: exposition.title }
  });

  if (existing) {
    await existing.update(exposition);
    console.log(`Exposition updated: ${existing.title}`);
  } else {
    const created = await ExpositionTopic.create(exposition);
    console.log(`Exposition created: ${created.title}`);
  }

  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
