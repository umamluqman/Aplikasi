export const extractMessage = (data: Object) => {
  const keys = Object.keys(data)
  if (keys) {
    return keys.reduce((curr, key) => {
      return curr.concat({
        type: 'value',
        name: key,
        message: data[key][0]
      })
    }, [])
  } else {
    return ''
  }
}
