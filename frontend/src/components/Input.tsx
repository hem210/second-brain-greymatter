interface InputProps {
    ref?: any;
    placeholder: string;
    type: string;
}

export function Input(props: InputProps) {
    const {ref, placeholder, type} = props;
    return <div>
        <input ref={ref} type={type} className="w-full px-4 py-2 rounded-md border my-2" placeholder={placeholder} />
    </div>
}