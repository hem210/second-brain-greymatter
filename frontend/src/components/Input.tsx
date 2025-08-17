interface InputProps {
    ref?: any;
    placeholder: string;
}

export function Input(props: InputProps) {
    const {ref, placeholder} = props;
    return <div>
        <input ref={ref} type={"text"} className="px-4 py-2 rounded-md border my-2" placeholder={placeholder} />
    </div>
}