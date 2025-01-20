import { X } from 'lucide-react';
export const Popup = ({onClose} : any) => {
    return(
        <div className=" fixed inset-0 bg-white backdrop-blur-sm flex justify-center items-center">
           <div className='mt-20 flex flex-col gap-5 text-customOrange'>
                <button className='place-self-end ' onClick={onClose}>< X size={30}/></button>
                <div className='bg-yellow-300 rounded-xl px-20 py-20 flex flex-col gap-5 items-center mx-4'>
                    <h1 className='text-3xl font-extrabold'>Room ID</h1>
                    <input className=' w-full px-4 py-3 border-yellow-600 rounded-md focus:outline-customOrange ' placeholder='room id' type='id' required></input>
                    <button className='mt-4 w-full bg-customOrange text-white py-2 rounded-xl '>Join</button>
                </div>
           </div>
        </div>
    )
}