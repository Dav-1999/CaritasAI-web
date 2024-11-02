<template>
  <div class="wordcloud-container">
    <vue-wordcloud
      :words="words"
      :animation-duration="3000"
      :rotation="rotation"
      :font-size-ratio="fontSizeRatio"
      :font-style="fontStyle"
      :color="color"
    />
  </div>
</template>

<script lang="ts" setup name="WordCloudComponent">
import VueWordcloud from 'vue-wordcloud';
const words= [
  { text: 'Vue', weight: 10 },
  { text: 'JavaScript', weight: 8 },
  { text: 'CSS', weight: 6 },
  { text: 'HTML', weight: 5 },
  { text: 'Web', weight: 7 },
  { text: 'Development', weight: 9 },
  { text: 'Frontend', weight: 10 },
  { text: 'Backend', weight: 8 },
  { text: 'Node.js', weight: 7 },
  { text: 'React', weight: 9 },
  { text: 'Angular', weight: 5 },
  { text: 'Python', weight: 4 },
  { text: 'Django', weight: 3 },
  { text: 'Flask', weight: 2 },
  { text: 'Database', weight: 6 },
  { text: 'SQL', weight: 4 },
  { text: 'NoSQL', weight: 5 },
  { text: 'MongoDB', weight: 3 },
  { text: 'MySQL', weight: 4 },
  { text: 'API', weight: 7 },
  { text: 'REST', weight: 5 },
  { text: 'GraphQL', weight: 3 },
  { text: 'Linux', weight: 2 },
  { text: 'AWS', weight: 6 },
  { text: 'Azure', weight: 5 },
  { text: 'Google Cloud', weight: 4 },
  { text: 'Data Science', weight: 7 },
  { text: 'Machine Learning', weight: 8 },
  { text: 'AI', weight: 9 },
  { text: 'Deep Learning', weight: 6 },
  { text: 'TensorFlow', weight: 5 },
  { text: 'Keras', weight: 4 },
  { text: 'PyTorch', weight: 3 },
  { text: 'NLP', weight: 2 },
  { text: 'Blockchain', weight: 7 },
  { text: 'Crypto', weight: 5 },
  { text: 'Ethereum', weight: 3 },
  { text: 'Bitcoin', weight: 4 }
  ]

      const rotation = () => Math.random() * 90 - 45;
      const fontSizeRatio= 0.1;
      const fontStyle= 'normal';
      const color= () => `hsl(${Math.random() * 360}, 100%, 50%)`

</script>

<style>
.wordcloud-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(to right, red, blue); /* 渐变色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.wordcloud-container span {
  display: inline-block;
  animation: rotateWord 10s linear infinite;
}

@keyframes rotateWord {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
