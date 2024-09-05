import * as Dialog from '@radix-ui/react-dialog'
import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
} from './styles'
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react'
import * as z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionsContext } from '../../contexts/TransactionsContext'
import { useContextSelector } from 'use-context-selector'
import { CurrencyInput } from 'react-currency-mask'
import { CategoriesContext } from '../../contexts/CategoriesContext'
import { useEffect, useState } from 'react'

const newTransactionSchema = z.object({
  description: z.string(),
  price: z.number().positive(),
  categoryId: z.string(),
  subCategoryId: z.string(),
  type: z.enum(['income', 'outcome']),
})

type NewTransactionInputs = z.infer<typeof newTransactionSchema>

export function NewTransactionModal() {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
    
  } = useForm<NewTransactionInputs>({
    resolver: zodResolver(newTransactionSchema),
  })

  const [showSubCategories, setShowSubCategories] = useState(false)

  const categoryId = watch('categoryId')

  useEffect(() => {
    const categoryId = watch('categoryId')
    if (categoryId && categoryId !== 'default') {
      setShowSubCategories(true)
    } else {
      setShowSubCategories(false)
    }
  }, [categoryId])


  const createTransaction = useContextSelector(TransactionsContext, (ctx) => {
    return ctx.createTransaction
  })

  const categories = useContextSelector(CategoriesContext, (ctx) => {
    return ctx.categories
  })



  async function handleCreateNewTransaction(data: NewTransactionInputs) {
    const { subCategoryId, description, price, type } = data
    await createTransaction({
      subCategoryId,
      description,
      price,
      type,
    })
    reset()
  }

  return (
    <Dialog.Portal>
      <Overlay />
      <Content>
        <Dialog.Title>Nova transação</Dialog.Title>
        <CloseButton>
          <X size={24} />
        </CloseButton>

        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input
            type="text"
            placeholder="Descrição"
            required
            {...register('description')}
          />

          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                value={field.value}
                onChangeValue={(_, value) => {
                  field.onChange(value)
                }}
                InputElement={<input placeholder="Preço" required />}
              />
            )}
          />

          
          <select defaultValue="default" {...register('categoryId')}>
            <option value="default" disabled hidden>Categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>))}
          </select>
          {showSubCategories && (
            <select defaultValue="default" {...register('subCategoryId')}>
              <option value="default" hidden disabled>Sub-categoria</option>
              {categories
                .find((category) => category.id === categoryId)
                ?.subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
            </select>
          )}


          <Controller
            control={control}
            name="type"
            render={({ field }) => {
              return (
                <TransactionType
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <TransactionTypeButton variant="income" value="income">
                    <ArrowCircleUp size={24} />
                    Entrada
                  </TransactionTypeButton>

                  <TransactionTypeButton variant="outcome" value="outcome">
                    <ArrowCircleDown size={24} />
                    Saída
                  </TransactionTypeButton>
                </TransactionType>
              )
            }}
          />

          <button type="submit" disabled={isSubmitting}>
            Cadastrar
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}
