import Image from 'next/image'
import luigiBanane from '../public/luigi-banane.png'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toBlob } from 'html-to-image'
import Button from '../src/components/Button'
import { saveAs } from 'file-saver'

export async function getBlob(domId = 'completeImage'): Promise<Blob | undefined> {
  const element = document.getElementById(domId)

  if (!element) {
    return
  }

  const blob = await toBlob(element)

  if (blob) {
    return blob
  }
}

export async function copyToClipBoard(domId = 'completeImage') {
  const blob = await getBlob(domId)

  if (!blob) {
    return
  }

  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
}

export async function pasteFromClipBoard(setImage: Dispatch<SetStateAction<Blob | undefined>>) {
  const clipboardItems = await navigator.clipboard.read()

  let foundItemType = ''
  const clipboardItem = clipboardItems.find((item) => {
    return item && item.types && item.types.find((itemType) => {
      if (itemType.indexOf('image') !== -1) {
        foundItemType = itemType
        return true
      }

      return false
    })
  })

  if (!clipboardItem) {
    return
  }

  const blob = await clipboardItem.getType(foundItemType)
  setImage(blob)
}

export function createPasteListener(setImage: Dispatch<SetStateAction<Blob | undefined>>) {
  return () => {
    pasteFromClipBoard(setImage)
  }
}

export async function save() {
  const blob = await getBlob()

  if (!blob) {
    console.log('no blob found, returning')
    return
  }

  saveAs(blob, 'luigi-banane.png')
}

export default function Home() {
  const [image, setImage] = useState<Blob>()
  const [text, setText] = useState<string>()

  useEffect(() => {
    const pasteListener = createPasteListener(setImage)
    document.addEventListener('paste', pasteListener)

    return () => {
      document.removeEventListener('paste', pasteListener)
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <header className="pt-5 pb-10 flex justify-center" >
        <h1 className="text-cyan-900 font-bold text-6xl lg:text-2xl">Luigi Banane</h1>
      </header>
      <main className="max-w-[980px]">
        <div className="relative" id="completeImage">
          <Image
            alt="Luigi Banane"
            src={luigiBanane} />
          <div
            className="absolute left-[50px] top-[104px] skewIt bg-white w-[487px] h-[276px] text-black flex items-center justify-center p-2"
          >{text}</div>
          {image && <Image
            className="absolute left-[50px] top-[104px] skewIt min-h-[276px] max-h-[276px]"
            alt="Screen image"
            src={URL.createObjectURL(image)}
            width="487"
            height="576"/>}
        </div>
        <div className="pt-5 flex flex-col lg:flex-row justify-between">
          <Button onClick={() => { pasteFromClipBoard(setImage) }}>Paste from clipboard</Button>
          <Button onClick={() => { copyToClipBoard() }}>Copy to clipboard</Button>
          <Button onClick={() => { save() }}>Save as</Button>
          <Button onClick={() => { setImage(undefined) }}>Clear image</Button>
        </div>
        <div className="flex flex-col mt-5">
          <label htmlFor="imageText">Custom text</label>
          <textarea
            id="imageText"
            onChange={(e) => {
              setText(e.target.value)
            }}
            defaultValue={text}
            className="border-2 rounded-md outline-0 border-cyan-900 mb-10"
          />
        </div>
      </main>

    </div>
  )
}
