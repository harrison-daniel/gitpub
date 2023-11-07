import Image from 'next/image';
import beerLight from '../../../public/assets/images/mug.png';
import beerDark from '../../../public/assets/images/beer-mug-dark.png';
import beerDark2 from '../../../public/assets/images/beer-mug-dark2.png';

export default function Background() {
  return (
    <>
      <div className='imgLight '>
        <Image
          src={beerLight}
          alt='Light Theme Beer'
          placeholder='empty'
          quality={100}
          priority
          fill
          // sizes='width: 100px; height: 100px;'
          style={{
            objectFit: 'contain ',
            objectPosition: 'top',
            zIndex: '-10',
            marginTop: '50px',
          }}
        />
      </div>
      <div className='imgDark '>
        <Image
          src={beerDark2}
          alt='Dark Theme Beer'
          placeholder='empty'
          quality={100}
          priority
          // sizes='width: 100px; height: 100px'
          fill
          style={{
            objectFit: 'contain ',
            objectPosition: 'top',
            zIndex: '-10',
            opacity: '0.5',
            marginTop: '40px',
          }}
        />
      </div>
    </>
  );
}

// import Image from 'next/image';
// import backgroundBeerMugLight from '../../../public/assets/images/mug.png';

// export default function Background() {
//   return (
//     <Image
//       alt='Frosted Beer Mug'
//       src={backgroundBeerMugLight}
//       c
//       priority
//       fill
//       className='mt-[55px] md:mt-[110px] lg:mt-[110px]'
//       style={{
//         objectFit: 'contain ',
//         objectPosition: 'top',
//         zIndex: '-10',
//         // top: '7.5%',
//       }}
//     />
//   );
// }
