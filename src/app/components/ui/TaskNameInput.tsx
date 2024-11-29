import { useState, useRef, useEffect } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

type TypeTaskNameInput = {
    taskNameChange?: Function;
    taskNameValue?: string;
    linkChange?: Function;
    linkValue?: string;
    required?:boolean;
}

function TaskNameInput({required, taskNameValue, taskNameChange, linkValue, linkChange }: TypeTaskNameInput) {
    const [taskName, setTaskName] = useState(taskNameValue || '');
    const [link, setLink] = useState(linkValue || '');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const inputRef = useRef(null);

    // Sync state with props when they change
    useEffect(() => {
        setTaskName(taskNameValue || '');
        setLink(linkValue || '');
    }, [taskNameValue, linkValue]);

    // Handle input changes
    const handleTextChange = (e) => {
        const value = e.target.value;
        setTaskName(value);
        if (taskNameChange) taskNameChange(value); // Notify parent about the change
    };

    // Handle paste events to capture HTML content
    const handlePaste = (e) => {
        e.preventDefault(); // Prevent default paste behavior

        const clipboardData = e.clipboardData;
        const htmlData = clipboardData.getData('text/html');
        const plainTextData = clipboardData.getData('text/plain');

        // Create a DOM parser to extract the link if HTML is available
        if (htmlData) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlData, 'text/html');
            const anchor = doc.querySelector('a');

            // Set task name and link based on the anchor tag
            if (anchor) {
                setTaskName(anchor.textContent); // Use anchor text as task name
                setLink(anchor.href); // Set the link
                if (taskNameChange) taskNameChange(anchor.textContent); // Notify parent about the change
                if (linkChange) linkChange(anchor.href); // Notify parent about the link
            } else {
                // If no link is found, just set the plain text value
                setTaskName(plainTextData); // Set plain text as task name
                setLink(''); // Reset link if no anchor found
                if (taskNameChange) taskNameChange(plainTextData); // Notify parent about the change
            }
        } else {
            // Fallback for plain text
            setTaskName(plainTextData); // Set plain text as task name
            setLink(''); // Reset link if no anchor found
            if (taskNameChange) taskNameChange(plainTextData); // Notify parent about the change
        }
    };

    const handleLinkChange = (e) => {
        const value = e.target.value;
        setLink(value);
        if (linkChange) linkChange(value); // Notify parent about the change
    };

    const handleToggleInput = () => {
        setShowLinkInput((prev) => !prev); // Toggle between inputs
    };

    // Handle click outside to close link view
    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setShowLinkInput(false);
        }
    };

    useEffect(() => {
        // Add event listener for clicks outside
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Cleanup the event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    let taskNameVisibility = link ? 'opacity-0 pointer-events-none absolute' : "";

    return (
        <div className="flex items-center gap-2" ref={inputRef}>
            {/* Text input for task name */}
            <label htmlFor='taskName-main' className="cursor-text group w-full gap-2 flex flex-row flex-nowrap items-center p-2 border rounded border-gray-200 shadow flex-1 hover:ring-1 focus-within:ring-1 text-2xl w-full !p-2 -m-2 ring-0 border-transparent shadow-none hover:ring-1 ring-app-orange-500/50">
                {!showLinkInput && (
                    <div className="relative">
                        <input
                            required={required}
                            id="taskName-main"
                            type="text"
                            value={taskName}
                            onChange={handleTextChange}
                            onPaste={handlePaste} // Handle paste events
                            placeholder="Enter task name"
                            className={`${taskNameVisibility} w-full group-has-[:focus-within]:relative group-has-[:focus-within]:opacity-100 group-has-[:focus-within]:pointer-events-all w-full border-none outline-none ring-0`}
                        />
                        {link && (
                            <Link className='text-blue-600 underline w-fit group-has-[:focus-within]:hidden' target='_blank' href={link}>
                                {taskName}
                            </Link>
                        )}
                    </div>
                )}

                {showLinkInput && (
                    <input
                        type="text"
                        value={link}
                        onChange={handleLinkChange}
                        placeholder="Enter link"
                        className="w-full border-none outline-none ring-0"
                    />
                )}

                <button onClick={handleToggleInput} type="button" className='ml-auto'>
                    <LinkIcon size={16} className="text-blue-500" />
                </button>
            </label>
        </div>
    );
}

export default TaskNameInput;
