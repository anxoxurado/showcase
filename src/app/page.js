import CatGallery from './components/CatGallery';
import AdviceSlip from './components/AdviceSlip';
/*import FunTranslationAdvice from './components/FunTransationAdvice';*/
import SpaceX from './components/SpaceX';

export default function Home() {
  return (
    <main>
      <CatGallery /><AdviceSlip /><SpaceX />
    </main>
  );
}