import Image from 'next/image'


export default function NotFoundPage() {
  return (
    <div className='flex justify-center items-center mt-40' >
        <Image src="/notfound.png" height={100} width={500}  alt="notfound" />
    </div>
  )
}
