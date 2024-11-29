"use client"

import { createId } from "@paralleldrive/cuid2"
import { CircleX } from "lucide-react";
import { ChangeEvent, ReactNode, useRef, useState } from "react"


type MultipleSelectItemType = {
    element?: ReactNode;
    text: string;
    value: any;
}

type MultipleSelectType = {
    name?:string;
    onChange?: (selectedItems:string[])=>void;
    value?: string[];
    list: MultipleSelectItemType[];
    placeholder?:string;


}
const MultipleSelect = ({placeholder = "",name,value = [],onChange,list}:MultipleSelectType) => {
    const [selectedItem, setSelectedItem] = useState<string[]>(value)
    const [selectActiveIndex, setSelectActiveIndex] = useState<number | null>(null)
    const [selectActiveValue,setSelectActiveValue] = useState("")
    const [filteredList,setFilteredList] = useState(list)
    const [filterKey, setFilterKey] = useState("")
    const selectionRef = useRef(null)

    if(!list) return


    const controlName = createId()
    function handleKeyDown(e:React.KeyboardEvent<HTMLInputElement>) {
        console.log(e)
        console.log(selectionRef)
        if (e.code === "Enter") {
            e.preventDefault()
            const selectionList = selectionRef.current
            if (!selectionList) return
            onItemSelect()

        } else if (e.code === "ArrowDown") {
            e.preventDefault()
            
            const selectionList = selectionRef.current
            const selectionItems = selectionList.children
            
            if (!selectionList) return
            if (!selectionItems.length) return
            
            document.querySelector('.custom-select-focused')?.classList.remove('custom-select-focused')
            let newIndex = selectActiveIndex

            if (newIndex == null || (selectActiveIndex != 0 && selectActiveIndex == selectionItems.length - 1)) {
                newIndex = 0

            } else {
                newIndex++
            }

            let newValue = selectionItems[newIndex].children.namedItem(controlName).value
            selectionItems[newIndex].classList.add('custom-select-focused')
            setSelectActiveIndex(newIndex)
            setSelectActiveValue(newValue)

        } else if (e.code === "ArrowUp") {
            e.preventDefault()
            const selectionList = selectionRef.current
            const selectionItems = selectionList?.children

            if (!selectionList) return
            if (!selectionItems.length) return
            document.querySelector('.custom-select-focused')?.classList.remove('custom-select-focused')
            let newIndex = selectActiveIndex
            if (newIndex == null) {
                newIndex = 0
            } else if (selectActiveIndex == 0) {
                newIndex = selectionItems.length - 1
            } else {
                newIndex--
            }

            let newValue = selectionItems[newIndex].children.namedItem(controlName).value
            selectionItems[newIndex].classList.add('custom-select-focused')
            setSelectActiveIndex(newIndex)
            setSelectActiveValue(newValue)

        } else if (e.code === "Backspace") {
            if (!e.target.value) {
                onItemRemove()
            }


        } 

    }
    
    function onFilterChange(value:string){
        const newfilteredList = list.filter(i => i.text.toLowerCase().includes(value.toLowerCase()))
        .filter(i => !selectedItem.includes(i.value))
    
        setFilteredList(newfilteredList)
        if(newfilteredList.length <= 0 ){
            setSelectActiveValue("")
            setSelectActiveIndex(null)
        }
    }

    function onItemSelect(value?:string) {
        console.log('updating selected items')
        const newSelectedItems = [...selectedItem, value ? value :selectActiveValue]

        setSelectedItem(newSelectedItems)
        setSelectActiveValue("")
        setSelectActiveIndex(null)
        setFilteredList(list.filter(i => !newSelectedItems.includes(i.value)))
        if(onChange){
            onChange(newSelectedItems)
        }
    
    }
    function onItemRemove(value?:string) {
        console.log('removing item')
        let newSelectedItems
        if(value){
            newSelectedItems = [...selectedItem.filter(i => i != value)]
        } else {
            newSelectedItems = selectedItem.slice(0, -1)
        }
        
        setSelectedItem(newSelectedItems)
        setSelectActiveValue("")
        setSelectActiveIndex(null)
        setFilteredList(list.filter(i => !newSelectedItems.includes(i.value)))
        if(onChange){
            onChange(newSelectedItems)
        }
    }

    function handleItemClick(e,v){
        console.log('item click')
        e.preventDefault()
        
        onItemSelect(v)
    }

    function handleRemoveItem(v:string){
        console.log('removing item')
        onItemRemove(v)
    }

    function handleOnInputChange(e:ChangeEvent<HTMLInputElement>){
        const inputEl = e.target
        
        if(!inputEl) return
        let filterKeyWord = inputEl.value 
        onFilterChange(filterKeyWord)
        setFilterKey(inputEl.value)
    }
    
    const hasSelectedItem = list.length > 0
    return (
        <div
        className="custom-select-wrapper flex flex-wrap whitespace-nowrap  min-w-32 flex-1 w-full">
            {hasSelectedItem ? list.filter(i => selectedItem.includes(i.value)).map((i,index) => <div key={`${i.value}${index}`} className="text-sm mention flex items-center gap-1 !w-fit !mx-1 !py-3 !px-2.5 !h-unset">
                {i.text}
                <CircleX onClick={()=>handleRemoveItem(i.value)} className="hover:text-red-400 opacity-50 hover:opacity-100 hover:cursor-pointer" size={18} strokeWidth={2} />
                </div>)
                :   <span>{placeholder}</span>  
            }
            <div className="relative z-[9999]">
                <input type="text" className="ring-0 outline-none border-none w-full" onKeyDown={(e) => handleKeyDown(e)} onChange={handleOnInputChange} value={filterKey} />
                <div className="custom-select-list max-h-[300px] overflow-auto bg-white text-sm shadow-lg ring-1 px-1 py-2 ring-gray-100 absolute w-full max-w-[100%] flex flex-col flex-nowrap gap-2" >
                    <div className="flex flex-col flex-nowrap gap-2" ref={selectionRef}>
                        {filteredList.length > 0 && filteredList.map((item,index) => {
                            return <label onClick={(e)=>handleItemClick(e, item.value)} className="custom-select-item rounded-lg p-1" key={`${item.value + index}`}>
                            <input type="hidden" name={controlName} value={item.value} />
                            <div className="pointer-events-none">{item.element ? item.element : item.text}</div>
                            </label>
                        })}
                    </div>
                        {filteredList.length <= 0 &&  <div className="pointer-events-none">No more item</div>}
                </div>
            </div>
        </div>
    );
}

export default MultipleSelect;