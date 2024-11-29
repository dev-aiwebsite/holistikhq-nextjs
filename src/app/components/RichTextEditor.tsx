"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.bubble.css';
import 'quill-mention/dist/quill.mention.css'; 
import { Mention, MentionBlot } from 'quill-mention';
import { useAppStateContext } from '@app/context/AppStatusContext';
import ProfileAvatar from './ui/ProfileAvatar';
import { renderToString } from 'react-dom/server';
import { Delta } from 'quill/core';
// Register the MentionBlot and Mention module
Quill.register({ 'formats/mention': MentionBlot, 'modules/mention': Mention });

type RichTextEditorProps = {
  onChange: (val?: string) => void;
  value?: string,
  theme?: string;
  onEnter?: (e:any)=>void;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({onEnter,theme, onChange, value }) => {
  const [editorHtml, setEditorHtml] = useState<string>(value || "");
  const { appState } = useAppStateContext()
  const onEnterRef = useRef(onEnter);
  const quillRef = useRef(null);
  const atValues = appState.users.map(user => {
    return {
      id: user.id,
      value: `${user.firstName} ${user.lastName}`,
      denotationChar: "@",
      profileImage: user.profileImage,
    }
  })

  
  const hashValues = [{ id: 1, value: "" }]

  const handleChange = (html: string) => {
    setEditorHtml(html);
    onChange(html);
  };
  

  useEffect(() => {
    onEnterRef.current = onEnter;
}, [onEnter]);

  useEffect(() => {
  
    if (!quillRef.current) return
    console.log(quillRef)
    // Ensure the Quill editor is ready
    if (!quillRef.current) return
      const quillEditor = quillRef.current.getEditor();
      const enterIndex = quillEditor.keyboard.bindings["Enter"].findIndex(i => i.handler.name == 'handleEnter')

      quillEditor.keyboard.bindings["Enter"][enterIndex] = {
          handler: function customHandleEnter(range, context) {
         
            console.log('quill editor enter')
            if (onEnterRef.current) {
              onEnterRef.current(context); 
          }
            // setIsEnter(isEnter + 1)
            return true;
          },
          key: "Enter", // Enter key
          shiftKey: false, // No shift key required
        }

        quillEditor.keyboard.addBinding({
          key: 13,
          shiftKey: true,
        }, function(range, context) {
          this.quill.insertText(range.index, '\n');
        });
    
  }, []);


  useEffect(() => {
    setEditorHtml(value || "")
  }, [value])

  const modules = {
    mention: {
      mentionDenotationChars: ['@', '#'],
      source: useCallback((searchTerm: string, renderList: any, mentionChar: string) => {
        let values
        if (mentionChar === "@") {
          values = atValues;
        } else {
          values = hashValues;
        }
        const matches = values.filter(value =>
          value.value.toLowerCase().includes(searchTerm.toLowerCase())
        );

        renderList(matches, searchTerm);
      }, []),
      renderItem: useCallback((item) => {
        const profileAvatarHtml = renderToString(
          <ProfileAvatar
            src={item.profileImage}
            className="w-9 h-9"
            fallbackClassName="!bg-app-orange-500"
            name={item.value}
            showName={true}
          />
        );
      
        // Create a div to hold the HTML string
        const div = document.createElement('div');
        div.innerHTML = profileAvatarHtml;
      
        return div; // Return the DOM node
      }, []),
    },
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  };

  return (
    <ReactQuill
      ref={quillRef}
      theme={theme}
      value={editorHtml}
      onChange={handleChange}
      modules={modules}
      placeholder="Write something..."
    />
  );
};

export default RichTextEditor;
