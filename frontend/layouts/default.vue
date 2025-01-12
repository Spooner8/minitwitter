<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-grow container">
      <div class="max-w-6xl p-4 w-full">
        <slot />
      </div>
    </main>
    <Footer />
  </div>
</template>
