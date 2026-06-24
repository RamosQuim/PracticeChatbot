import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';

// rafce for shortcut for react arrow function export component

type FormData = {
   prompt: string;
};

// use 'rafce' for automatic structure of React component
const ChatBot = () => {
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = (data: FormData) => {
      console.log(data);
      reset();
   };

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         onKeyDown={onKeyDown}
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-2xl"
      >
         <textarea
            {...register('prompt', {
               required: true,
               validate: (data) => data.trim().length > 0,
            })}
            placeholder="Ask anything"
            maxLength={1000}
            className="w-full border-0 focus:outline-0 resize-none"
         />
         <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatBot;
