/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router'
import { Button } from '../../components/button'
import { GetTags } from '../../data/api'
import { ResponsiveMasonry } from '../../components/responsive-masonry'
import { Loading } from '../../components/loading'
import { renderMediaType } from '../../components/media-types'
import { Page, Container, Padding } from '../../components/layout'
import { PATH } from '../../constants'
import styles from './styles.module.scss'

const axios = require('axios')

export const Tags = () => {
  const { id } = useParams()
  const [error, setError] = useState(false)
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = () => {
    setCount(count + 1)
  }

  useEffect(async () => {
    if (error) {
      console.log('returning on error')
      return
    }

    const next = items.concat(
      await axios
        .post(process.env.REACT_APP_GRAPHQL_TAGS, { tag: id })
        .then((res) => res.data)
    )
    next.map((e) => console.log(e))
    setItems(next)

    /* 
    GetTags({ tag: id, counter: count })
      .then((result) => {
        const next = items.concat(result)
        setItems(next)

        // if original returns less than 10, then there's no more data coming from API
        if (result.length < 10) {
          setHasMore(false)
        }
      })
      .catch((e) => {
        setError(true)
      }) */
  }, [count, id])

  return (
    <Page title={`Tag ${id}`}>
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <Container xlarge>
            <Padding>
              <Loading />
            </Padding>
          </Container>
        }
        endMessage={
          <Container xlarge>
            {/*             <p>
              mint mint mint{' '}
              <span role="img" aria-labelledby={'Sparkles emoji'}>
                ✨
              </span>
            </p> */}
          </Container>
        }
      >
        <div className={styles.container}>
          <Container xlarge>
            <ResponsiveMasonry>
              {items.map((nft) => {
                return (
                  <Button key={nft.id} to={`${PATH.OBJKT}/${nft.id}`}>
                    <div className={styles.container}>
                      {renderMediaType({
                        mime: nft.mime,
                        artifactUri: nft.artifact_uri,
                        displayUri: nft.display_uri,
                      })}
                      {/* <div className={styles.number}>OBJKT#{nft.token_id}</div> */}
                    </div>
                  </Button>
                )
              })}
            </ResponsiveMasonry>
          </Container>
        </div>
      </InfiniteScroll>
    </Page>
  )
}
