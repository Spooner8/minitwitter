<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-extrabold mb-6 text-center text-gray-800">Über Minitwitter</h1>
    
    <div class="bg-white shadow-lg rounded-xl p-6 space-y-6">
      <p class="text-lg text-gray-700 leading-relaxed">
        Minitwitter ist eine minimalistische Social-Media-Plattform, inspiriert von Twitter, die eine schlanke und moderne 
        Benutzererfahrung bietet. Unser Ziel war es, eine Full-Stack-Anwendung zu entwickeln, die nicht nur performant 
        und skalierbar ist, sondern auch moderne Technologien und Best Practices nutzt.
      </p>

      <h2 class="text-2xl font-semibold text-gray-800">🚀 Tech-Stack</h2>
      <ul class="list-disc list-inside space-y-2 text-gray-700">
        <li><strong>Backend:</strong> Express.js, PostgreSQL, Redis, Ollama AI, Prometheus & Grafana</li>
        <li><strong>Frontend:</strong> Nuxt.js, TailwindCSS, Google Fonts, @nuxt/icon</li>
        <li><strong>DevOps:</strong> Docker, Nginx, K6 Performance-Testing</li>
      </ul>

      <h2 class="text-2xl font-semibold text-gray-800">🛠 Installation & Nutzung</h2>
      <p class="text-gray-700">
        Minitwitter lässt sich schnell aufsetzen. Alles, was du brauchst, ist Node.js, Bun und Docker für die Datenbank- und 
        Redis-Container. Mehr Details findest du in unserer Dokumentation auf GitHub!
      </p>

      <h2 class="text-2xl font-semibold text-gray-800">🤝 Das Team</h2>
      <p class="text-gray-700">
        Dieses Projekt wurde von <strong>Swen, Lukas und Gianluca</strong> entwickelt. Wir durften dieses Projekt im Rahmen unserer Ausbildung an der HF Teko in Olten entwickeln. Dabei setzten wir auf moderne Webtechnologien und performante Webanwendungen.
      </p>

      <h2 class="text-2xl font-semibold text-gray-800">📜 Lizenz</h2>
      <p class="text-gray-700">Minitwitter ist Open Source und steht unter der MIT-Lizenz.</p>

      <p class="text-center">
        👉 <a href="https://github.com/Spooner8/minitwitter" class="text-blue-600 font-semibold hover:underline">GitHub-Repository</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Über Minitwitter',
  description: 'Erfahre mehr über das Projekt Minitwitter'
})
</script>
