import { IPagination } from "@/types";
import { Box, Button, IconButton, iconButtonClasses } from "@mui/joy";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

interface IProps {
    usePagination: IPagination;
    LoadRows(url: string | null | boolean): void;
}

function TablePagination({ usePagination, LoadRows }: IProps) {
    return (
        <>
            <Box
                className="Pagination-laptopUp"
                sx={{
                    pt: 2,
                    gap: 1,
                    [`& .${iconButtonClasses.root}`]: {
                        borderRadius: "50%",
                    },
                    display: {
                        xs: "none",
                        md: "flex",
                    },
                }}
            >
                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    disabled={
                        usePagination.links[usePagination.links.length - 1]
                            ?.url == null
                    }
                    onClick={() =>
                        LoadRows(
                            usePagination.links[usePagination.links.length - 1]
                                ?.url,
                        )
                    }
                    startDecorator={<KeyboardArrowRightIcon />}
                >
                    تیره صفحه
                </Button>

                <Box sx={{ flex: 1 }} />
                {usePagination.links.map(
                    (page, index: number) =>
                        Number(page.label) > 0 && (
                            <IconButton
                                key={index}
                                size="sm"
                                variant={page.active ? "solid" : "outlined"}
                                color={page.active ? "primary" : "neutral"}
                                onClick={() => LoadRows(page.url)}
                            >
                                {page.label}
                            </IconButton>
                        ),
                )}
                <Box sx={{ flex: 1 }} />

                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    disabled={usePagination.links[0]?.url == null}
                    onClick={() => LoadRows(usePagination.links[0]?.url)}
                    endDecorator={<KeyboardArrowLeftIcon />}
                >
                    راتلونکي صفحه
                </Button>
            </Box>
        </>
    );
}

export default TablePagination;
