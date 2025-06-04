import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog.jsx";
import { Avatar, AvatarImage, AvatarFallback } from './avatar.jsx';
import { MoreHorizontal } from 'lucide-react';
// import { DialogTrigger } from '@radix-ui/react-dialog';
const Comment = ({ setDialog, showComment }) => {
  return (
    <Dialog open={showComment}>
      <DialogContent onInteractOutside={() => setDialog(false)} className='w-[70%] h-[95%] p-0 border-none rounded-none outline-none overflow-hidden'>
        <div className=' flex h-full w-full' name='comment-container'>
          <div className='w-1/2 ' name="left-side image">
            <img src="https://burst.shopifycdn.com/photos/person-stands-on-rocks-poking-out-of-the-ocean-shoreline.jpg?width=1000&format=pjpg&exif=0&iptc=0" alt='post_img'
              className='w-full h-full object-cover'>
            </img>
          </div>
          <div name="right-side" className='flex flex-col w-1/2 h-full overflow-y-auto'>

            <div className='flex w-full items-center pr-3 pl-3 pt-4 pb-4 justify-between border-b border-[#FFFFFF50] '>
              <div className='flex items-center gap-2'>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  Bio
                </div>
              </div>
              <Dialog >
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' />
                </DialogTrigger>
                <DialogContent className="w-[25%] p-0 outline-none border-none flex flex-col items-center justify-center dark:bg-[#1e1e1e] gap-0">

                  <div className='w-full  border-b border-[#FFFFFF50] pt-3 pb-3 text-center rounded-t-md cursor-pointer text-[#ED4956] font-bold'>Unfollow</div>
                  <div className='w-full  border-b border-[#FFFFFF50] pt-3 pb-3 text-center rounded-t-md cursor-pointer'>Share</div>
                  <div className='w-full  border-b border-[#FFFFFF50] pt-3 pb-3 text-center rounded-t-md cursor-pointer'>Copy Link</div>
                  <div className='w-full  pt-3 pb-3 text-center rounded-b-md cursor-pointer'>Add to favourites</div>

                </DialogContent>
              </Dialog>
            </div>
            <div
              className='overflow-y-auto p-3 w-full hide-scrollbar max-h-160'
              style={{
                msOverflowStyle: 'none',  /* IE and Edge */
                scrollbarWidth: 'none',   /* Firefox */
              }}
            >
              <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore dolores quis dignissimos quidem tenetur saepe fugiat officiis assumenda beatae amet voluptas perspiciatis voluptates optio asperiores, debitis aliquam vitae! Laudantium illo tempora sed ea vitae similique, id temporibus neque dignissimos, sunt dolorum beatae velit itaque enim? Numquam possimus minima iure doloribus porro tempora alias placeat voluptates nihil, modi nam provident recusandae aut nemo molestias saepe pariatur eligendi doloremque velit repudiandae laborum facere quod reiciendis. Saepe ut esse voluptatibus ea ex impedit voluptatem accusantium nemo perferendis illum beatae asperiores totam obcaecati cum perspiciatis eligendi assumenda consequatur, neque porro et voluptatum error nisi rem. Ad sunt cum veritatis itaque excepturi recusandae, vel porro eaque laudantium sed. Tenetur asperiores, ad similique dolor eum cupiditate exercitationem accusantium repellendus nemo unde nobis aliquam corrupti? Doloribus labore recusandae soluta nisi, sunt voluptatem dolorem suscipit impedit harum distinctio quia inventore nostrum veniam cum ipsum vitae nobis corporis totam saepe eos esse, odio blanditiis quo id! Sapiente quam aliquam provident officiis consectetur optio temporibus quos asperiores pariatur dolores suscipit qui harum sed, inventore illo! Nemo fuga maiores ad laudantium voluptatem eveniet vitae minus quae, delectus voluptatum. Id dicta facere laboriosam ad doloremque quo tempora. Laborum, nesciunt? Vel, distinctio molestiae et facere doloribus dolorem ipsam assumenda odio mollitia earum. Expedita nesciunt aliquid quis obcaecati ipsa ducimus explicabo voluptates odio aperiam voluptatibus quia cum sunt atque sed qui maiores sequi culpa in, quam amet sit perferendis consequatur? Obcaecati aliquam eaque excepturi sint dolore velit dolorum voluptatem officia cum, veniam porro eius culpa nisi placeat tempore ad fugit iste voluptatum totam quod? Eius tempore cupiditate quos facilis quibusdam dolores quisquam soluta optio est, iusto sequi fugiat aperiam cum ab laboriosam nulla voluptate voluptatibus officia iste aut blanditiis, voluptatum delectus. Soluta asperiores magnam quas unde magni modi, quia quasi saepe repellat dicta esse in debitis rem necessitatibus voluptates. Veniam voluptate labore dignisssapiente hic.
            </div>
            <div>
              Helloooooooooo
            </div>
          </div>

        </div>

      </DialogContent>
    </Dialog >)
}

export default Comment
