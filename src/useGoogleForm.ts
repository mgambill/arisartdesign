//https://script.google.com/macros/s/AKfycbzK90x-a18bltjw2AD64hQhrYQzx4m1Baiy8vQsmwOB81Wi_3V-Ip0a0AIt5k62GC73Dw/exec
import { useAsyncState } from '@vueuse/core'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const useGoogleForm = (url: string) => {
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const isError = ref(false)

  const reset = () => {
    // reset state
    isError.value = false
    isLoading.value = false
    isSuccess.value = false
  }

  const execute = async <T>(payload: T) => {
    reset()
    isLoading.value = true

    await delay(1000)

    try {
      const response = await fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        redirect: 'follow',
        body: JSON.stringify(payload)
      }).then((r) => r.json())

      console.log('response:', response)

      if (response.result === 'success') {
        isLoading.value = false
        isSuccess.value = true

        return response
        // plausible("Signup", {
        //   callback: () => console.log("submission logged"),
        //   props: { success: true },
        // });
      } else {
        isError.value = true
      }
    } catch (err) {
      console.error(err)
      isError.value = true
    } finally {
      await delay(1000)
    }
  }

  return { execute, reset, isLoading, isSuccess, isError }
}
