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
      className='mt-[55px] md:mt-[110px] lg:mt-[110px]'
      style={{
        objectFit: 'contain ',
        objectPosition: 'top',
        zIndex: '-10',
        // top: '7.5%',
      }}
    />
  );
}
