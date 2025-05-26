export const initialStore=()=>{
  return{
    logged: false,
    message: null,
    todos: [],
    products: []
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
    
    case 'handle_login':
      return {
        ...store,
        logged: action.payload
      };
    case 'add_product':
      return {
        ...store,
        products: [...store.products, action.payload]
      };
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    default:
      throw Error('Unknown action.');
  }    
}
