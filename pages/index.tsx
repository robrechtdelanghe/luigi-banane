import Image from 'next/image'
import luigiBanane from '../public/luigi-banane.png'
import styles from '../styles/Home.module.css'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export function pasteListener(setImage: Dispatch<SetStateAction<File | null | undefined>>) {
  return (evt: ClipboardEvent) => {
    // Get the data of clipboard
    if (!evt || !evt.clipboardData) {
      return
    }

    const clipboardItems: DataTransferItemList = evt.clipboardData.items;
    console.log(clipboardItems)
    const items = [].slice.call(clipboardItems).filter(function (item: DataTransferItem) {
      console.log(item)
      // Filter the image items only
      // return false
      return item && item.type && item.type.indexOf('image') !== -1
    });
    console.log(items)
    if (items.length === 0) {
      return;
    }

    const item = items[0] as DataTransferItem
    const blob = item.getAsFile()
    console.log(blob)
    setImage(blob)
  }
}

export default function Home() {
  const [image, setImage] = useState<File | null>()

  useEffect(() => {
    console.log('Adding pasteListener')
    document.addEventListener('paste', pasteListener(setImage))

    return () => {
      console.log('Removing pasteListener')
      document.removeEventListener('paste', pasteListener(setImage))
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <header className="pt-5 pb-10 flex justify-center" >
        <h1 className="text-2xl text-cyan-900 font-bold">Luigi Banane</h1>
      </header>
      <main className="max-w-[980px] bg-amber-200">
        <div className="relative">
          <Image
            alt="Luigi Banane"
            src={luigiBanane} />
          {image ?  <Image
            className="absolute left-[50px] top-[104px] skewIt min-h-[298px] max-h-[298px]"
            alt="Screen image"
            src={URL.createObjectURL(image)}
            width="487"
            height="576"/> : <div
            className="absolute left-[50px] top-[104px] skewIt bg-white w-[487px] h-[276px]"
          />}
        </div>
      </main>

    </div>
  )
}
