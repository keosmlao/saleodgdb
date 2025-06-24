import { Input } from 'antd';

const TextInput = ({
    label,
    placeholder = 'Please select',
    allowClear = true,
    icon,
    name
}) => {
    return (
        <div className="w-full mb-4">
            <label >{icon}</label>
            <label className="block font-medium text-gray-700 mb-1">{label}</label>
            <Input name={name} allowClear={allowClear} placeholder={placeholder} />
        </div>
    );
};

export default TextInput;
