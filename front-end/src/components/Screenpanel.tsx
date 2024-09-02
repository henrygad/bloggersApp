import { ReactElement, useEffect, useState } from 'react'
import tw from 'tailwind-styled-components'

type Props = {
  initailWidth: number
  Children: ReactElement
  dragEle: boolean
  minWidth: number
  maxWidth: number
  order?: number
  full?: boolean
  mobileDefaultWidth: number
}

const Screenpanel = ({ Children, initailWidth, dragEle, minWidth, maxWidth, order, full, mobileDefaultWidth }: Props) => {
  const [size, setSize] = useState(initailWidth)
  const [isSizing, setIsSizing] = useState(false)

  const handleMouseDown = () => setIsSizing(true)

  useEffect(() => {
    const handleResized = () => {
      if (window.innerWidth <= 480) {
        setSize(mobileDefaultWidth)
        setIsSizing(false)
      }
    }
    window.addEventListener('resize', handleResized)

    if (!isSizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const movement = e.movementX
      let newWidth = size + movement
      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth))
      setSize(newWidth)
    }

    const handleMouseUp = () => setIsSizing(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('resize', handleResized)
    }
  }, [size, isSizing])


  return <div
    className={`flex justify-end ${full && 'grow'} shrink-0`}
    style={{ width: `${size}px`, order: `${order}` }}
  >
    <div className='flex-1 h-full p-4'>
      {Children}
    </div>
    {dragEle && <Dragele
      onMouseDown={handleMouseDown}
    >
    </Dragele>}
  </div>
}

export default Screenpanel

const Dragele = tw.div`
    hidden
    md:block 
    w-[1px] 
    h-full
    bg-gray-100
    hover:w-[2px]
    hover:bg-sky-400
    transition
    cursor-col-resize
`