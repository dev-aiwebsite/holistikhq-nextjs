
// import React, { useCallback, useState } from 'react';
// import ReactQuill, {Quill} from 'react-quill-new';
// import 'react-quill-new/dist/quill.snow.css';
// import 'quill-mention/dist/quill.mention.css';
// import {Mention, MentionBlot} from "quill-mention";
// Quill.register({ 'formats/mention': MentionBlot, 'modules/mention': Mention });
// type RichTextEditorProps = {
//     onChange: (val?:string)=> void;
// }



// const RichTextEditor = ({onChange}:RichTextEditorProps) => {
//     const [editorValue, setEditorValue] = useState('');

//     const handleOnChange = (val:string) => {
//         onChange(val)
//         setEditorValue(val)
//     }
//     const atValues = [
//     { id: 1, value: 'Fredrik Sundqvist' },
//     { id: 2, value: 'Patrik Sjölin' }
//   ];
//   const hashValues = [
//     { id: 3, value: 'Fredrik Sundqvist 2' },
//     { id: 4, value: 'Patrik Sjölin 2' }
//   ]

//   const formats = [
//     'header',
//     'bold', 'italic', 'underline', 'strike', 'blockquote',
//     'list', 'bullet', 'indent',
//     'link', 'image'
//   ]
  
//   const modules = {
//     mention: {
//         allowedChars: /^[A-Za-z\s]*$/,
//         mentionDenotationChars: ["@", "#"],
//         source: useCallback((searchTerm, renderList, mentionChar) => {
//           let values;
    
//           if (mentionChar === "@") {
//             values = atValues;
//           } else {
//             values = hashValues;
//           }
    
//           if (searchTerm.length === 0) {
//             renderList(values, searchTerm);
//           } else {
//             const matches = [];
//             for (i = 0; i < values.length; i++)
//               if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
//             renderList(matches, searchTerm);
//           }
//         },[]),
//       },
//     toolbar: [
//       [{ 'header': [1, 2, 3] }],
//       ['bold', 'italic', 'underline','strike', 'blockquote'],
//       [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
//       ['link', 'image'],
//       ['clean']
//     ],
//   }

//     return <ReactQuill theme="snow" value={editorValue} onChange={(val)=> handleOnChange(val)} 
//     formats={formats}
//     modules={modules}/>;
// };

// export default RichTextEditor;


import React, { useCallback, useEffect, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Import Quill styles
import 'quill-mention/dist/quill.mention.css'; // Import Mention styles
import { Mention, MentionBlot } from 'quill-mention';

// Register the MentionBlot and Mention module
Quill.register({ 'formats/mention': MentionBlot, 'modules/mention': Mention });

type RichTextEditorProps = {
  onChange: (val?: string) => void;
  value?: string
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ onChange, value }) => {
  const [editorHtml, setEditorHtml] = useState<string>(value || "");

        const atValues = [
    { id: 1, value: 'Fredrik Sundqvist' },
    { id: 2, value: 'Patrik Sjölin' }
  ];
  const hashValues = [
    { id: 3, value: 'Fredrik Sundqvist 2' },
    { id: 4, value: 'Patrik Sjölin 2' }
  ]

  const handleChange = (html: string) => {
    setEditorHtml(html);
    onChange(html);
  };

  useEffect(() => {
    setEditorHtml(value || "")
  },[value])

  const modules = {
    mention: {
      mentionDenotationChars: ['@','#'],
      source: useCallback((searchTerm: string, renderList: (matches: Array<{ id: number; value: string }>) => void,mentionChar:string) => {
        console.log(mentionChar)
        let values
        if (mentionChar === "@") {
            values = atValues;
          } else {
            values = hashValues;
          }
        const matches = values.filter(value =>
          value.value.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderList(matches);
      },[])
    },
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  };

  return (
    <ReactQuill
      value={editorHtml}
      onChange={handleChange}
      modules={modules}
      placeholder="Write something..."
    />
  );
};

export default RichTextEditor;
