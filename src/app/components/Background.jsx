import Image from 'next/image';
import backgroundBeerMugLight from '../../../public/assets/images/mug.png';

export default function Background() {
  return (
    <Image
      alt='Frosted Beer Mug'
      src={backgroundBeerMugLight}
      placeholder='empty'
      quality={75}
      priority
      fill
      className='rotated'
      style={{
        objectFit: 'contain ',
        zIndex: '-10',
      }}
    />
  );
}
