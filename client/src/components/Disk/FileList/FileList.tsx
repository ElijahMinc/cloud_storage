import { AnimatePresence } from 'framer-motion';
import React from 'react'
import { useAppSelector } from '@hooks/useAppRedux';
import { fileSelector } from '@redux/slices/FileSlice';
import { MFile} from './File/File'
import {motion} from 'framer-motion'
interface IFileList {

}

const MFileVariant = {
   initial: (idx: number) => ({
      x: idx % 2 === 0 ? -200 : 200,
      y: 100,
      opacity: 0,
     
   }),
   animate: (idx: number) => ({
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
         delay: idx * 0.2,
         type: 'tween',
         stiffness: 700,
         // damping: 30
      }
   })
}

export const FileList: React.FC<IFileList> = () => {

   const {  files } = useAppSelector(fileSelector)

   return (
      <AnimatePresence exitBeforeEnter >

      <motion.div layout className='file-list'>
      {/* custom={MFileConfig} initial="initial" animate="animate" */}
            {!!files.length && files.map((file, idx) => (
               <MFile layout custom={idx} initial="initial" animate="animate" variants={MFileVariant}  key={file._id} {...file} />
            ))}

      </motion.div>
      </AnimatePresence>

      )
}