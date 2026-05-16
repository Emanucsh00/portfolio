<script setup>
import { messagingTopic } from '../../content/messagingTopic';

const directRisks = [
  'Dependencia fuerte entre servicios',
  'Si B falla, A tambien se afecta',
  'Escala peor cuando sube la carga'
];
</script>

<template>
  <q-page class="landing-page landing-animated">
    <section class="landing-hero shell-width reveal-up reveal-delay-1">
      <div class="landing-hero-copy">
        <div class="landing-kicker">TEMA DE EXPOSICION</div>
        <h1>{{ messagingTopic.title }}</h1>
        <h2>{{ messagingTopic.subtitle }}</h2>
        <p>{{ messagingTopic.heroNote }}</p>

        <div class="landing-hero-actions">
          <q-btn color="secondary" label="Volver al inicio" to="/" />
          <q-btn outline color="primary" label="Ver proyectos" to="/projects" />
        </div>

        <div class="landing-author">{{ messagingTopic.presenter }}</div>
      </div>

      <div class="landing-hero-art">
        <div class="hero-orbit hero-orbit-left"></div>
        <div class="hero-orbit hero-orbit-right"></div>
        <div class="hero-cloud">
          <span>Broker</span>
          <strong>Mensajeria asincrona</strong>
        </div>
        <div class="hero-badge hero-badge-top">RabbitMQ</div>
        <div class="hero-badge hero-badge-bottom">ActiveMQ</div>
        <div class="hero-badge hero-badge-side">SNS</div>
      </div>
    </section>

    <section class="landing-section shell-width reveal-up reveal-delay-2">
      <div class="landing-section-head">
        <div class="eyebrow">{{ messagingTopic.intro.eyebrow }}</div>
        <h2>{{ messagingTopic.intro.title }}</h2>
        <p>{{ messagingTopic.intro.body }}</p>
      </div>

      <div class="problem-solution-grid">
        <article class="landing-panel landing-panel-soft reveal-up reveal-delay-3">
          <span class="diagram-label">Comunicacion directa</span>
          <div class="landing-diagram-card diagram-surface">
            <svg viewBox="0 0 620 230" class="landing-svg" aria-label="Diagrama de comunicacion directa">
              <rect x="40" y="58" width="120" height="120" rx="28" fill="#3f89e2" />
              <text x="100" y="132" text-anchor="middle" font-size="58" font-weight="700" fill="#ffffff">A</text>
              <rect x="460" y="58" width="120" height="120" rx="28" fill="#56b748" />
              <text x="520" y="132" text-anchor="middle" font-size="58" font-weight="700" fill="#ffffff">B</text>
              <line x1="180" y1="118" x2="430" y2="118" stroke="#223950" stroke-width="18" stroke-linecap="round" />
              <polygon points="430,95 430,141 468,118" fill="#223950" />
              <text x="305" y="84" text-anchor="middle" font-size="28" font-weight="700" fill="#223950">Directo</text>
              <circle cx="84" cy="206" r="18" fill="#ff4f5e" />
              <text x="118" y="214" font-size="20" font-weight="700" fill="#38253a">Dependencia</text>
              <circle cx="286" cy="206" r="18" fill="#ff4f5e" />
              <text x="320" y="214" font-size="20" font-weight="700" fill="#38253a">Falla compartida</text>
            </svg>
          </div>
          <ul class="landing-list">
            <li v-for="risk in directRisks" :key="risk">{{ risk }}</li>
          </ul>
        </article>

        <article class="landing-panel landing-panel-contrast reveal-up reveal-delay-4">
          <span class="diagram-label">{{ messagingTopic.queueDefinition.eyebrow }}</span>
          <h3>{{ messagingTopic.queueDefinition.title }}</h3>
          <p>{{ messagingTopic.queueDefinition.body }}</p>

          <div class="landing-diagram-card landing-diagram-card-dark diagram-surface">
            <svg viewBox="0 0 760 270" class="landing-svg" aria-label="Diagrama con broker intermediario">
              <rect x="24" y="98" width="146" height="92" rx="24" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.14)" />
              <text x="97" y="152" text-anchor="middle" font-size="30" font-weight="700" fill="#ffffff">Productor</text>
              <line x1="180" y1="144" x2="290" y2="144" stroke="#79a8dc" stroke-width="14" stroke-linecap="round" />
              <polygon points="290,122 290,166 326,144" fill="#79a8dc" />
              <rect x="328" y="74" width="104" height="140" rx="22" fill="#ff922f" />
              <rect x="344" y="96" width="72" height="24" rx="12" fill="rgba(255,255,255,0.24)" />
              <rect x="344" y="128" width="72" height="24" rx="12" fill="rgba(255,255,255,0.24)" />
              <rect x="344" y="160" width="72" height="24" rx="12" fill="rgba(255,255,255,0.24)" />
              <text x="380" y="236" text-anchor="middle" font-size="24" font-weight="700" fill="#ffffff">Broker / Queue</text>
              <line x1="438" y1="144" x2="548" y2="144" stroke="#79a8dc" stroke-width="14" stroke-linecap="round" />
              <polygon points="548,122 548,166 584,144" fill="#79a8dc" />
              <rect x="586" y="98" width="150" height="92" rx="24" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.14)" />
              <text x="661" y="152" text-anchor="middle" font-size="30" font-weight="700" fill="#ffffff">Consumidor</text>
              <text x="380" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#f8e9d3">Comunicacion asincrona</text>
            </svg>
          </div>
        </article>
      </div>
    </section>

    <section class="landing-section landing-band reveal-up reveal-delay-2">
      <div class="shell-width">
        <div class="landing-section-head compact">
          <div class="eyebrow">CONCEPTOS BASE</div>
          <h2>Que necesitamos saber antes de comparar brokers</h2>
        </div>

        <div class="concept-grid">
          <article
            v-for="(item, index) in messagingTopic.concepts"
            :key="item.title"
            class="concept-card reveal-up"
            :class="`reveal-delay-${(index % 4) + 1}`"
          >
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="landing-section shell-width reveal-up reveal-delay-2">
      <div class="landing-section-head">
        <div class="eyebrow">BROKERS</div>
        <h2>RabbitMQ y ActiveMQ cumplen el mismo proposito con enfoques distintos</h2>
      </div>

      <div class="broker-compare-grid">
        <article
          v-for="(broker, index) in messagingTopic.brokers"
          :key="broker.name"
          class="broker-card reveal-up"
          :class="[`reveal-delay-${index + 1}`, `broker-card-${broker.accent}`]"
        >
          <div class="broker-card-head">
            <h3>{{ broker.name }}</h3>
            <span>{{ broker.accent === 'orange' ? 'AMQP' : 'JMS / Java' }}</span>
          </div>

          <ul class="landing-list landing-list-tight">
            <li v-for="point in broker.points" :key="point">{{ point }}</li>
          </ul>

          <p>{{ broker.summary }}</p>
        </article>
      </div>
    </section>

    <section class="landing-section shell-width reveal-up reveal-delay-2">
      <div class="landing-section-head">
        <div class="eyebrow">DIFERENCIAS</div>
        <h2>Comparacion rapida entre RabbitMQ y Apache ActiveMQ</h2>
      </div>

      <div class="differences-table">
        <div class="differences-head rabbit">RabbitMQ</div>
        <div class="differences-head active">Apache ActiveMQ</div>
        <template v-for="row in messagingTopic.differences" :key="`${row.rabbit}-${row.active}`">
          <div class="differences-cell rabbit">{{ row.rabbit }}</div>
          <div class="differences-cell active">{{ row.active }}</div>
        </template>
      </div>
    </section>

    <section class="landing-section landing-band-dark reveal-up reveal-delay-2">
      <div class="shell-width architecture-grid">
        <div class="landing-section-head inverse">
          <div class="eyebrow">ARQUITECTURA GENERAL</div>
          <h2>El flujo base de cualquier sistema de mensajeria</h2>
          <p>Un productor envia, el broker organiza, y el consumidor procesa cuando esta listo.</p>
        </div>

        <div class="architecture-diagram">
          <div class="architecture-step">
            <div class="architecture-icon producer">P</div>
            <strong>Productor</strong>
            <span>Publica mensajes</span>
          </div>
          <div class="architecture-arrow"></div>
          <div class="architecture-step">
            <div class="architecture-icon broker">B</div>
            <strong>Broker</strong>
            <span>Enruta y almacena</span>
          </div>
          <div class="architecture-arrow"></div>
          <div class="architecture-step">
            <div class="architecture-icon consumer">C</div>
            <strong>Consumidor</strong>
            <span>Recibe y procesa</span>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section shell-width reveal-up reveal-delay-2">
      <div class="landing-duo-grid">
        <article class="landing-panel rabbit-flow-panel reveal-up reveal-delay-2">
          <div class="eyebrow">RABBITMQ INTERNO</div>
          <h2>Exchange antes de Queue</h2>
          <p>En RabbitMQ el productor no publica directo a la cola; primero pasa por un exchange.</p>

          <div class="landing-diagram-card diagram-surface">
            <svg viewBox="0 0 720 270" class="landing-svg" aria-label="Diagrama interno de RabbitMQ">
              <rect x="24" y="102" width="112" height="74" rx="22" fill="#ff8c25" />
              <text x="80" y="146" text-anchor="middle" font-size="24" font-weight="700" fill="#ffffff">Productor</text>
              <line x1="144" y1="139" x2="246" y2="139" stroke="#497fbe" stroke-width="12" stroke-linecap="round" />
              <polygon points="246,118 246,160 278,139" fill="#497fbe" />
              <circle cx="342" cy="138" r="54" fill="#2f5f96" />
              <circle cx="342" cy="138" r="26" fill="none" stroke="#ffffff" stroke-width="8" />
              <line x1="342" y1="84" x2="342" y2="64" stroke="#ff8c25" stroke-width="8" stroke-linecap="round" />
              <line x1="390" y1="138" x2="410" y2="138" stroke="#ff8c25" stroke-width="8" stroke-linecap="round" />
              <line x1="342" y1="192" x2="342" y2="212" stroke="#ff8c25" stroke-width="8" stroke-linecap="round" />
              <line x1="294" y1="138" x2="274" y2="138" stroke="#ff8c25" stroke-width="8" stroke-linecap="round" />
              <text x="342" y="236" text-anchor="middle" font-size="24" font-weight="700" fill="#2f5f96">Exchange</text>
              <line x1="398" y1="116" x2="482" y2="92" stroke="#497fbe" stroke-width="10" stroke-linecap="round" />
              <line x1="398" y1="138" x2="482" y2="138" stroke="#497fbe" stroke-width="10" stroke-linecap="round" />
              <line x1="398" y1="160" x2="482" y2="184" stroke="#497fbe" stroke-width="10" stroke-linecap="round" />
              <rect x="486" y="56" width="110" height="42" rx="16" fill="#d7e7fb" stroke="#97b6de" />
              <rect x="486" y="117" width="110" height="42" rx="16" fill="#d7e7fb" stroke="#97b6de" />
              <rect x="486" y="178" width="110" height="42" rx="16" fill="#d7e7fb" stroke="#97b6de" />
              <text x="541" y="83" text-anchor="middle" font-size="18" font-weight="700" fill="#22466f">Queue A</text>
              <text x="541" y="144" text-anchor="middle" font-size="18" font-weight="700" fill="#22466f">Queue B</text>
              <text x="541" y="205" text-anchor="middle" font-size="18" font-weight="700" fill="#22466f">Queue C</text>
              <line x1="602" y1="138" x2="664" y2="138" stroke="#497fbe" stroke-width="10" stroke-linecap="round" />
              <polygon points="664,120 664,156 694,138" fill="#497fbe" />
              <rect x="600" y="102" width="110" height="74" rx="22" fill="#61b24b" />
              <text x="655" y="146" text-anchor="middle" font-size="22" font-weight="700" fill="#ffffff">Consumer</text>
            </svg>
          </div>

          <ul class="landing-list landing-list-tight">
            <li v-for="step in messagingTopic.rabbitFlow" :key="step">{{ step }}</li>
          </ul>
        </article>

        <article class="landing-panel active-models-panel reveal-up reveal-delay-3">
          <div class="eyebrow">ACTIVEMQ MODELOS</div>
          <h2>Punto a punto y publicacion / suscripcion</h2>

          <div class="active-visual-grid">
            <div class="landing-diagram-card diagram-surface">
              <svg viewBox="0 0 320 220" class="landing-svg" aria-label="Modelo queue un consumidor">
                <rect x="42" y="34" width="82" height="114" rx="22" fill="#69ad43" />
                <rect x="56" y="54" width="54" height="18" rx="9" fill="rgba(255,255,255,0.25)" />
                <rect x="56" y="80" width="54" height="18" rx="9" fill="rgba(255,255,255,0.25)" />
                <rect x="56" y="106" width="54" height="18" rx="9" fill="rgba(255,255,255,0.25)" />
                <text x="83" y="176" text-anchor="middle" font-size="18" font-weight="700" fill="#345522">Queue</text>
                <line x1="126" y1="92" x2="212" y2="92" stroke="#4e79a5" stroke-width="12" stroke-linecap="round" />
                <polygon points="212,72 212,112 242,92" fill="#4e79a5" />
                <circle cx="250" cy="92" r="34" fill="#f2d4aa" />
                <circle cx="250" cy="78" r="10" fill="#6d513d" />
                <path d="M232 116 Q250 96 268 116" stroke="#6d513d" stroke-width="8" fill="none" stroke-linecap="round" />
                <text x="160" y="206" text-anchor="middle" font-size="18" font-weight="700" fill="#38253a">Single consumer</text>
              </svg>
            </div>

            <div class="landing-diagram-card diagram-surface">
              <svg viewBox="0 0 320 220" class="landing-svg" aria-label="Modelo topic multiples consumidores">
                <ellipse cx="160" cy="72" rx="74" ry="34" fill="#9dceff" />
                <text x="160" y="80" text-anchor="middle" font-size="24" font-weight="700" fill="#2b4f7d">Topic</text>
                <line x1="160" y1="106" x2="74" y2="152" stroke="#4e79a5" stroke-width="8" stroke-linecap="round" />
                <line x1="160" y1="106" x2="160" y2="156" stroke="#4e79a5" stroke-width="8" stroke-linecap="round" />
                <line x1="160" y1="106" x2="246" y2="152" stroke="#4e79a5" stroke-width="8" stroke-linecap="round" />
                <circle cx="74" cy="170" r="22" fill="#ffd38a" />
                <circle cx="160" cy="176" r="22" fill="#d9cdec" />
                <circle cx="246" cy="170" r="22" fill="#8ed0cb" />
                <text x="160" y="208" text-anchor="middle" font-size="18" font-weight="700" fill="#38253a">Multiple consumers</text>
              </svg>
            </div>
          </div>

          <div class="active-model-grid">
            <div v-for="model in messagingTopic.activeModels" :key="model.title" class="active-model-card">
              <strong>{{ model.title }}</strong>
              <p>{{ model.description }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="landing-section shell-width reveal-up reveal-delay-2">
      <div class="landing-section-head">
        <div class="eyebrow">OPERACION Y CONTROL</div>
        <h2>Tipos de colas, ACK y DLQ</h2>
        <p>La mensajeria no es solo mover datos: tambien requiere orden, confirmaciones y manejo de errores.</p>
      </div>

      <div class="queue-types-grid">
        <article
          v-for="(item, index) in messagingTopic.queueTypes"
          :key="item.title"
          class="queue-type-card reveal-up"
          :class="`reveal-delay-${(index % 4) + 1}`"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>

      <div class="reliability-grid">
        <article
          v-for="(item, index) in messagingTopic.reliability"
          :key="item.title"
          class="landing-panel reliability-card reveal-up"
          :class="`reveal-delay-${index + 2}`"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <div v-if="item.title === 'ACK'" class="landing-diagram-card diagram-surface">
            <svg viewBox="0 0 620 170" class="landing-svg" aria-label="Secuencia de acknowledgement">
              <rect x="18" y="58" width="104" height="52" rx="18" fill="#d7e7fb" />
              <rect x="176" y="58" width="104" height="52" rx="18" fill="#ffd38a" />
              <rect x="334" y="58" width="104" height="52" rx="18" fill="#c9e5bf" />
              <rect x="492" y="58" width="104" height="52" rx="18" fill="#f1d3d9" />
              <text x="70" y="92" text-anchor="middle" font-size="22" font-weight="700" fill="#26476d">Recibe</text>
              <text x="228" y="92" text-anchor="middle" font-size="22" font-weight="700" fill="#6a4716">Procesa</text>
              <text x="386" y="92" text-anchor="middle" font-size="22" font-weight="700" fill="#3c6b2f">ACK</text>
              <text x="544" y="92" text-anchor="middle" font-size="22" font-weight="700" fill="#7a3440">Elimina</text>
              <line x1="122" y1="84" x2="160" y2="84" stroke="#497fbe" stroke-width="8" stroke-linecap="round" />
              <line x1="280" y1="84" x2="318" y2="84" stroke="#497fbe" stroke-width="8" stroke-linecap="round" />
              <line x1="438" y1="84" x2="476" y2="84" stroke="#497fbe" stroke-width="8" stroke-linecap="round" />
            </svg>
          </div>
          <div v-else class="landing-diagram-card diagram-surface">
            <svg viewBox="0 0 620 170" class="landing-svg" aria-label="Flujo hacia Dead Letter Queue">
              <polygon points="98,34 138,104 58,104" fill="#da473f" />
              <text x="98" y="94" text-anchor="middle" font-size="34" font-weight="700" fill="#ffffff">!</text>
              <text x="98" y="136" text-anchor="middle" font-size="22" font-weight="700" fill="#6e221e">Error</text>
              <line x1="154" y1="82" x2="290" y2="82" stroke="#2f3341" stroke-width="10" stroke-linecap="round" />
              <polygon points="290,60 290,104 324,82" fill="#2f3341" />
              <rect x="344" y="34" width="160" height="96" rx="18" fill="#4a4b55" />
              <rect x="364" y="52" width="120" height="22" rx="8" fill="rgba(255,255,255,0.12)" />
              <rect x="364" y="82" width="120" height="22" rx="8" fill="rgba(255,255,255,0.12)" />
              <text x="424" y="154" text-anchor="middle" font-size="24" font-weight="700" fill="#2f3341">DLQ</text>
            </svg>
          </div>
        </article>
      </div>
    </section>

    <section class="landing-section landing-sns-section reveal-up reveal-delay-2">
      <div class="shell-width sns-grid">
        <div class="landing-section-head">
          <div class="eyebrow">{{ messagingTopic.sns.eyebrow }}</div>
          <h2>{{ messagingTopic.sns.title }}</h2>
          <p>{{ messagingTopic.sns.body }}</p>
        </div>

        <div class="sns-diagram diagram-surface">
          <svg viewBox="0 0 620 340" class="landing-svg" aria-label="Diagrama SNS publicacion y suscripcion">
            <ellipse cx="310" cy="82" rx="112" ry="44" fill="#ffaf51" />
            <text x="310" y="92" text-anchor="middle" font-size="30" font-weight="700" fill="#ffffff">SNS Topic</text>
            <line x1="310" y1="126" x2="130" y2="210" stroke="#497fbe" stroke-width="10" stroke-linecap="round" />
            <line x1="310" y1="126" x2="310" y2="210" stroke="#497fbe" stroke-width="10" stroke-linecap="round" />
            <line x1="310" y1="126" x2="490" y2="210" stroke="#497fbe" stroke-width="10" stroke-linecap="round" />
            <rect x="54" y="212" width="152" height="82" rx="24" fill="#d7e7fb" />
            <rect x="234" y="212" width="152" height="82" rx="24" fill="#cfe9c4" />
            <rect x="414" y="212" width="152" height="82" rx="24" fill="#ddd3f5" />
            <text x="130" y="258" text-anchor="middle" font-size="24" font-weight="700" fill="#26476d">Email</text>
            <text x="310" y="258" text-anchor="middle" font-size="24" font-weight="700" fill="#35632b">Backend</text>
            <text x="490" y="258" text-anchor="middle" font-size="24" font-weight="700" fill="#4c3a77">SQS</text>
          </svg>
        </div>
      </div>
    </section>

    <section class="landing-section landing-conclusion reveal-up reveal-delay-3">
      <div class="shell-width landing-conclusion-card">
        <div class="eyebrow inverse">CONCLUSION</div>
        <h2>Mensajeria para sistemas mas estables y escalables</h2>
        <p>{{ messagingTopic.conclusion }}</p>
      </div>
    </section>
  </q-page>
</template>
