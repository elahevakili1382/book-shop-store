import{ref, watch} from 'vue'

export function useDebounce<T>(value:T, delay = 500){
    const debounced = ref(value)

    let timeout: ReturnType<typeof setTimeout>

    watch(
        ()=> value,
        (val) => {
            clearTimeout(timeout)
            timeout = setTimeout(() =>{
                debounced.value = val
            }, delay)
        }
    )

    return debounced
}